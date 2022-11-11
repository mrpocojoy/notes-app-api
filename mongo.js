const mongoose = require('mongoose')
const mongoURL = process.env.MONGODB_URI

module.exports = () => {

  console.log(`Connecting MongoDB @${mongoURL}`)
  mongoose.connect(mongoURL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.log('Error connecting to MongoDB:', error.message))

  process.on('uncaughtException', () => {
    mongoose.connection.disconnect()
  })
}

