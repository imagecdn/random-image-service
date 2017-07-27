const logger = require('../util/logger')

module.exports = function requestLogger(req, res, next) {
  req.log = message => logger.info(`${req.id} ${message}`)
  next()
}
