const uuid = require('uuid/v4')

module.exports = function assignRequestId (req, res, next) {
  req.id = uuid()
  next()
}