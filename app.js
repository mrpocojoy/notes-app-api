const express = require('express')
const app = express()
const cors = require('cors')

const { SENTRY_DSN } = require('./utils/config')
const sentry = require('./utils/sentry')

const { MONGODB_URI } = require('./utils/config')
const database = require('./utils/database.js')
const middleware = require('./utils/middleware')

const { notesRouter } = require('./controllers/notes')


/*************************************************
*   Configuration
*************************************************/
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
app.use(express.json())


/*  Sentry initialization  */
sentry.start(app, SENTRY_DSN)   //TODO: Review Sentry, it might have issues


/*  Database connection  */
database.connect(MONGODB_URI)


/*  Serve static resources  */
app.use(express.static('static/build'))
app.use('/images', express.static('static/images'))



/*************************************************
*   Middlewares: Loggers & Trackers 
*************************************************/
sentry.requestHandler()
sentry.tracingHandler()

app.use(middleware.requestLogger)


/*************************************************
*   Routers List  
*************************************************/
app.use('/api/notes', notesRouter)


// TODO: Other route controllers to be added here...



/*************************************************
*   Middlewares: Error Handlers 
*************************************************/
app.use(middleware.unknownEndPoint)
sentry.errorHandler()
app.use(middleware.errorHandler)


module.exports = app