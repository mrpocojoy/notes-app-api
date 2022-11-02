const mongoose = require('mongoose')


// MongoDB Connection
const mongoURL = process.env.MONGODB_URI

console.log(`Connecting MongoDB @${mongoURL}`)
mongoose.connect(mongoURL)
  .then((result) => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error connecting to MongoDB:', error.message))


// Notes Schema
const noteSchema = new mongoose.Schema({
  userId: Number,
  title: String,
  body: String,
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
