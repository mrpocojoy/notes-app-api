require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const requestLogger = require('./loggerMiddleware')
const app = express()
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.clear()
  console.log('\n************************************')
  console.log(`RELOAD. Server running on port ${PORT}`)
  console.log('************************************\n')
})



/*****************************************
 *  DB MODELS
*****************************************/
const Note = require('./models/note')



/*****************************************
 *  HELPER MIDDLEWARES
*****************************************/

// Search for static frontend build (./build)
app.use(express.static('build'))

// Convert requests' body information to JSON
app.use(express.json())

// Adding a custom formatted logs to server console
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
morgan.token('content', (request) => JSON.stringify(request.body))
app.use(requestLogger)

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
 *  GET REQUESTS
*****************************************/

app.get('/', (request, response) => {
  response.send(`Welcome to backend!`)
})


app.get('/api/notes', (request, response, next) => {
  Note
    .find({})
    .then(result => response.json(result))
    .catch(error => next(error))
})


app.get('/api/notes/:id', (request, response, next) => {
  Note
    .findById(request.params.id)
    .then(result => {
      if (!result)
        return next()

      response.json(result)
    })
    .catch(error => next(error))
})



/*****************************************
 *  POST REQUESTS
*****************************************/

app.post('/api/notes', (request, response, next) => {
  const reqBody = request.body

  if (!reqBody || !reqBody.body)
    throw 'Missing note content'

  const newNote = new Note({
    userId: reqBody.userId || Math.floor(Math.random() * 100),
    title: reqBody.title || reqBody.body,
    body: reqBody.body,
    important: reqBody.important || false
  })

  newNote
    .save()
    .then(result => response.status(201).json(result))
    .catch(error => next(error))
})


/*****************************************
 *  PUT REQUESTS
*****************************************/

app.put('/api/notes/:id', (request, response, next) => {
  Note
    .findByIdAndUpdate(request.params.id, { ...request.body }, { new: true })
    .then(result => {
      if (!result)
        return next()

      response.json(result)
    })
    .catch(error => next(error))
})


/*****************************************
 *  DELETE REQUESTS
*****************************************/

app.delete('/api/notes/:id', (request, response, next) => {
  Note
    .findByIdAndDelete(request.params.id)
    .then(result => {
      if (!result)
        next()

      response.status(204).json(result)
    })
    .catch(error => next(error))
})



/*****************************************
 *  HTTP 4XX HANDLERS
****************************************/

// 404 - UNKNOWN ENDPOINT
app.use((request, response) => {
  response.status(404).send({ error: 'HTTP404 - Unknown Endpoint.' })
})


// 400 - BAD CLIENT REQUEST
app.use((error, request, response, next) => {
  console.error("Error message", error.message)

  if (error.name === 'CastError')
    return response.status(400).send({ error: 'Wrong ID Format.' })

  return response.status(400).send({ error })
})

// mongoose.connection.close()
