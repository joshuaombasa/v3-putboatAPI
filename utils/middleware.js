const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info('Path', request.path)
    logger.info('Method', request.method)
    logger.info('Body', request.body)
    logger.info('___')

    next()
}

const uknownEndpointsHandler = (request, response) => {
    response.status(400).json({error: 'unknown endpoint'})
}

const errorHandler = (error,request,response, next) => {
    logger.error(error.message)
    if (error.name === 'CastError') {
        response.status(400).json({error: "malformatted id"})
    } else if (error.name === 'ValidationError') {
        response.status(400).json({error: error.message})
    } else if(error.name === "JsonWebTokenError") {
        response.status(400).json({error: 'token missing or invalid'})
    } else if (error.name === "TokenExpiredError") {
        response.status(400).json({error: 'token expired'})
    }
    next()
}

module.exports = {requestLogger, uknownEndpointsHandler, errorHandler}