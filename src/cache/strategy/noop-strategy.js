const BaseStrategy = require('./base-strategy')

class NoopStrategy extends BaseStrategy
{
    static isValid() {
        return true
    }

    static get name() {
        return 'No-Op'
    }

    has(key) {
        return new Promise((resolve, reject) => reject(new Error({key})))
    }
    
    get(key) {
        return new Promise(resolve => resolve({key}))
    }

    set(key, value) {
        return new Promise(resolve => resolve({key, value}))
    }

    delete(key) {
        return new Promise(resolve => resolve({key}))
    }
}

module.exports =  NoopStrategy