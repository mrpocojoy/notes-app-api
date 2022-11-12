const logger = require('./utils/logger')
const mongoose = require('mongoose')
// const mongoURL = process.env.MONGODB_URI


const connect = (mongoURL) => {
  console.log(`Connecting MongoDB @${mongoURL}`)
  mongoose.connect(mongoURL)
    .then(() => logger.info('Connected to MongoDB'))
    .catch(error => logger.error('Error connecting to MongoDB:', error.message))
}

module.exports = { connect }