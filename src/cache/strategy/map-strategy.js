const BaseStrategy = require('./base-strategy')

// A Caching strategy relying on Maps.
// Perfectly adequate, and on by default.
class MapStrategy extends BaseStrategy
{
    static isValid() {
        return process.env.NODE_ENV !== 'development'
    }

    static get name() {
        return 'Map'
    }

    constructor() {
        super()
        this.map = new Map()
    }

    has(key) {
        return new Promise((resolve, reject) =>
            this.map.has(key) ? resolve(true) : reject(new Error(false))
        )
    }
    
    get(key) {
        return new Promise(resolve => resolve(this.map.get(key)))
    }

    set(key, value) {
        return new Promise(resolve => resolve(this.map.set(key, value)))
    }

    delete(key) {
        return new Promise(resolve => resolve(this.map.delete(key)))
    }
}

module.exports = MapStrategy