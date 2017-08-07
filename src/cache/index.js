// Prioritised caching strategies.
// No-op will always catch, so array always valid.
const Logger = require('../util/logger')
const strategies = require('./strategy')

const Strategy = strategies.filter(strategy => strategy.isValid()).shift()
Logger.info(`Using ${Strategy.name} caching strategy.`)
module.exports = new Strategy()
