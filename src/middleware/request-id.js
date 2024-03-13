const { v4: uuid } = require('uuid')

module.exports = (req, res, next) => {
  req.id = uuid()
  next()
}
