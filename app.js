const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const boatRouter = require('./controllers/boats')
const vendorsRouter = require('./controllers/vendors')

const app = express()

app.use(express.json())

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URL)
      .then(() => logger.info('connected to mongodb'))
      .catch((error) => logger.error(error.message))

app.use(middleware.requestLogger)
app.use('/api/boats',boatRouter)
app.use('/api/vendors',vendorsRouter)
app.use(middleware.uknownEndpointsHandler)
app.use(middleware.errorHandler)


module.exports = app
