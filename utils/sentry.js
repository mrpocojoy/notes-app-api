const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

const start = (app, SENTRY_DNS) => {
  Sentry.init({
    dsn: SENTRY_DNS,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  })
}

const requestHandler = Sentry.Handlers.requestHandler
const tracingHandler = Sentry.Handlers.tracingHandler
const errorHandler = Sentry.Handlers.errorHandler


module.exports = {
  start,
  requestHandler,
  tracingHandler,
  errorHandler
}