const notesRouter = require('express').Router()
const Note = require('../models/Note.js')



/*****************************************
 *  ROUTE CONTROLLERS
*****************************************/


/***** GET  *****/

// Obtain all notes from DB
notesRouter.get('/', (request, response, next) => {
  Note
    .find({})
    .then(notes => response.json(notes))
    .catch(error => next(error))
})


// Obtain specific note from DB, based on noteID
notesRouter.get('/:id', (request, response, next) => {
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
notesRouter.post('/', (request, response, next) => {
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
notesRouter.put('/:id', (request, response, next) => {
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
notesRouter.delete('/:id', (request, response, next) => {
  Note
    .findByIdAndDelete(request.params.id)
    .then(deletedNote => {
      return deletedNote
        ? response.status(204).json(deletedNote)
        : next('Unknown note ID')
    })
    .catch(error => next(error))
})


module.exports = { notesRouter }