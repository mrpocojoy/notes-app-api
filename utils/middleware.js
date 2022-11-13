const logger = require('./logger')

/*  REQUEST LOGGING MIDDLEWARE  */
const requestLogger = (request, response, next) => {
  logger.requestDetails(request)
  next()
}


/*  UNKNOWN ENDPOINT MIDDLEWARE  */
const unknownEndPoint = (request, response) => {
  logger.error('404 ->', 'Unknown Endpoint')
  response.status(404).send({ error: 'HTTP404 -> Unknown Endpoint.' })
}


/*  ERROR HANDLING MIDDLEWARE  */
const errorHandler = (error, request, response, next) => {
  logger.error('ERROR ->', error.message || error)

  if (error.name === 'CastError')
    return response.status(400).send({ error: 'Wrong ID Format.' })

  if (error.name === 'ValidationError') {
    return response.status(400).json({
      title: 'Validation Error',
      issues: Object.keys(error.errors).map(fieldKey => ({
        path: error.errors[fieldKey].path,
        issue: error.errors[fieldKey].name,
        value: error.errors[fieldKey].value,
        message: error.errors[fieldKey].message,
      }))
    })
  }
  
  
  response.status(500).send({ error })
  next()
}


module.exports = {
  requestLogger,
  unknownEndPoint,
  errorHandler,
}