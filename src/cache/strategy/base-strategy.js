class BaseStrategy {

    static isValid() {
        return false
    }

    has(key) {
        return new Promise((resolve, reject) => {
            reject(new Error('Not implemented'))
        })
    }

    get(key) {
        return new Promise((resolve, reject) => {
            reject(new Error('Not implemented'))
        })
    }

    set(key, value) {
        return new Promise((resolve, reject) => {
            reject(new Error('Not implemented'))
        })
    }

    delete(key) {
        return new Promise((resolve, reject) => {
            reject(new Error('Not implemented'))
        })
    }
}

module.exports = BaseStrategy