const logger = require('../util/logger')

module.exports = (req, res, next) => {
  req.log = message => logger.info(`${req.id} ${message}`)
  next()
}
