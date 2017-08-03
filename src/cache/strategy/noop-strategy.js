const BaseStrategy = require('./base-strategy')

class NoopStrategy extends BaseStrategy
{
    static isValid() {
        return true
    }

    has(key) {
        return new Promise((resolve, reject) => reject(false))
    }
    
    get(key) {
        return new Promise(resolve => resolve())
    }

    set(key, value) {
        return new Promise(resolve => resolve())
    }

    delete(key) {
        return new Promise(resolve => resolve())
    }
}

module.exports =  NoopStrategy