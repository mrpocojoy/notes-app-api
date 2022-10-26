const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const requestLogger = require('./loggerMiddleware')

const app = express()
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.clear()
  console.log('\n************************************')
  console.log(`RELOAD. Server running on port ${PORT}`)
  console.log('************************************\n')
})


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
 *  HARDCODED DATABASE
*****************************************/

let { notes } = require('./db.json')

const generateId = () => {
  return (1 + (notes.length ? Math.max(...notes.map(({ id }) => id)) : 0))
}



/*****************************************
 *  GET REQUESTS
*****************************************/

app.get('/', (request, response) => {
  response.send(`Welcome to backend!`)
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const reqId = Number(request.params.id)
  const note = notes.find(({ id }) => id === reqId)

  if (!note)
    response.status(404).send(`Note id=${reqId} not found`)

  response.json(note)
})



/*****************************************
 *  POST REQUESTS
*****************************************/

app.post('/api/notes', (request, response) => {
  const reqBody = request.body

  if (!reqBody || !reqBody.body)
    return response.status(400).json({
      error: 'Missing note information'
    })

  const newNote = {
    id: generateId(),
    userId: Math.floor(Math.random() * 100),
    title: reqBody.title || reqBody.body,
    body: reqBody.body,
    important: reqBody.important || false
  }
  notes = notes.concat(newNote)

  response.status(201).json(newNote)
})


/*****************************************
 *  PUT REQUESTS
*****************************************/

app.put('/api/notes/:id', (request, response) => {
  const reqBody = request.body
  const reqId = Number(request.params.id)

  if (!reqBody || !reqBody.body || !reqBody.userId)
    return response.status(400).json({
      error: 'Missing note information'
    })

  if (!notes.filter(({ id }) => id === reqId))
    return response.status(400).json({
      error: 'Note to update not found'
    })

  const updatedNote = {
    id: reqId,
    userId: reqBody.userId,
    title: reqBody.title || reqBody.body,
    body: reqBody.body,
    important: reqBody.important || false
  }
  notes = notes.map((note) => note.id !== reqId ? note : updatedNote)

  response.json(updatedNote)
})


/*****************************************
 *  DELETE REQUESTS
*****************************************/

app.delete('/api/notes/:id', (request, response) => {
  const reqId = Number(request.params.id)
  notes = notes.filter(({ id }) => id !== reqId)

  response.status(204).end()
})


/*****************************************
 *  DEFAULT ROUTES
*****************************************/

