const winston = require('winston')
const {Papertrail} = require('winston-papertrail') // eslint-disable-line no-unused-vars

class Logger extends winston.Logger {

    constructor() {
        const transports = []

        transports.push(new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        }))

        if (process.env.PAPERTRAIL_HOST && process.env.PAPERTRAIL_PORT) {
            transports.push(new winston.transports.Papertrail({
                host: process.env.PAPERTRAIL_HOST,
                port: process.env.PAPERTRAIL_PORT,
                program: 'random-image-api'
            }))
        }

        super({
            transports,
            exitOnError: false
        })

        this.stream = {
            write: message => this.info(message.trim('\n'))
        }
    }
}

module.exports = new Logger()
