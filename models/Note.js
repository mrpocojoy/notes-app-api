const mongoose = require('mongoose')

// Notes Schema
const noteSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  title: String,
  body: {
    type: String,
    minlength: 5,
    required: true
  },
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Note', noteSchema)
