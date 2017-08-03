// Prioritised caching strategies.
// No-op will always catch, so array always valid.
const strategies = require('./strategy')
const Strategy = strategies.filter(strategy => strategy.isValid()).shift()
module.exports = new Strategy()
