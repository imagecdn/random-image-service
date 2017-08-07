const throwError = val => new Error(`Not implemented: ${val}`)

class BaseStrategy {

    static isValid() {
        return false
    }

    static get name() {
        return 'Base'
    }

    has(key) {
        return new Promise((resolve, reject) => {
            reject(throwError({key}))
        })
    }

    get(key) {
        return new Promise((resolve, reject) => {
            reject(throwError({key}))
        })
    }

    set(key, value) {
        return new Promise((resolve, reject) => {
            reject(throwError({key, value}))
        })
    }

    delete(key) {
        return new Promise((resolve, reject) => {
            reject(throwError({key}))
        })
    }
}

module.exports = BaseStrategy