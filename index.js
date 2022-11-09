require('dotenv').config()
const PORT = process.env.PORT

const express = require('express')
const app = express()
const cors = require('cors')

const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

const consoleLogger = require('./middleware/console-logger')
const notFound = require('./middleware/not-found')
const handleErrors = require('./middleware/handle-errors')



/*****************************************
 *  PORT LISTENER
*****************************************/
app.listen(PORT, () => {
  console.clear()
  console.log('\n************************************')
  console.log(`RELOAD. Server running on port ${PORT}`)
  console.log('************************************\n')
})



/*****************************************
 *  MONGO DB
*****************************************/
const connectDB = require('./mongo.js')
const Note = require('./models/Note.js')

connectDB()



/*****************************************
 *  SENTRY INIT+CONFIG
*****************************************/
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())



/*****************************************
 *  HELPER MIDDLEWARES
*****************************************/

// Search for static frontend build (./build)
app.use(express.static('build'))

// Serve static content in /images folder to API
app.use('/images', express.static('images'))

// Convert requests' body information to JSON
app.use(express.json())

// Adding a custom formatted logs to server console
app.use(consoleLogger)

// Enabling CROSS-ORIGIN requests
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
  // origin: function (origin, callback) {
  //   // db.loadOrigins is an example call to load a list of origins from a backing database
  //   db.loadOrigins(function (error, origins) {
  //     callback(error, origins)
  //   })
  // }
}
app.use(cors(corsOptions))



/*****************************************
 *  ROUTE CONTROLLERS
*****************************************/


/***** GET  *****/

// Obtain all notes from DB
app.get('/api/notes', (request, response, next) => {
  Note
    .find({})
    .then(notes => response.json(notes))
    .catch(error => next(error))
})


// Obtain specific note from DB, based on noteID
app.get('/api/notes/:id', (request, response, next) => {
  Note
    .findById(request.params.id)
    .then(note => {
      return note
        ? response.json(note)
        : next('Unknown note ID')
    })
    .catch(error => next(error))
})



/***** POST  *****/

// Add new note to DB, based on request.body
app.post('/api/notes', (request, response, next) => {
  const reqBody = request.body

  const newNote = new Note({
    text: reqBody.text,
    date: new Date().toISOString(),
    important: reqBody.important || false
  })

  newNote
    .save()
    .then(savedNote => response.status(201).json(savedNote))
    .catch(error => next(error))
})



/***** PUT  *****/

// Edit existing note in DB, based on noteID
app.put('/api/notes/:id', (request, response, next) => {
  Note
    .findByIdAndUpdate(request.params.id, { ...request.body }, { new: true })
    .then(updatedNote => {
      return updatedNote
        ? response.json(updatedNote)
        : next('Unknown note ID')
    })
    .catch(error => next(error))
})



/***** DELETE  *****/

// Delete existing note in DB, based on noteID
app.delete('/api/notes/:id', (request, response, next) => {
  Note
    .findByIdAndDelete(request.params.id)
    .then(deletedNote => {
      return deletedNote
        ? response.status(204).json(deletedNote)
        : next('Unknown note ID')
    })
    .catch(error => next(error))
})



/*****************************************
 *  ERROR HANDLERS
****************************************/

// 404 - UNKNOWN ENDPOINT
app.use(notFound)

// SENTRY REPORTING
app.use(Sentry.Handlers.errorHandler())

// OTHER ERRORS
app.use(handleErrors)

