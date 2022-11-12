const logger = require('./logger')


const requestLogger = (request, response, next) => {
  logger.requestDetails(request)
  next()
}


const unknownEndPoint = (request, response) => {
  logger.error('404 ->', 'Unknown Endpoint')
  response.status(404).send({ error: 'HTTP404 -> Unknown Endpoint.' })
}

const errorHandler = (error, request, response, next) => {
  logger.error('ERROR ->', error.message || error)

  if (error.name === 'CastError')
    return response.status(400).send({ error: 'Wrong ID Format.' })

  if (error.name === 'ValidationError')
    return response.status(400).json({ error: error.message })


  response.status(500).send({ error })
  next()
}


module.exports = {
  requestLogger,
  unknownEndPoint,
  errorHandler,
}