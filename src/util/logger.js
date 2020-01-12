const {createLogger, transports} = require('winston')
const {Papertrail} = require('winston-papertrail') // eslint-disable-line no-unused-vars

const activeTransports = []
activeTransports.push(new transports.Console({
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
}))

if (process.env.PAPERTRAIL_HOST && process.env.PAPERTRAIL_PORT) {
    activeTransports.push(new transports.Papertrail({
        host: process.env.PAPERTRAIL_HOST,
        port: process.env.PAPERTRAIL_PORT,
        program: 'random-image-api'
    }))
}

const logger = createLogger({
    transports: activeTransports
})

logger.stream = {
    write: (message) => logger.info(message)
}

module.exports = logger
