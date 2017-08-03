const BaseStrategy = require('./base-strategy')
const redis = require('redis')

/**
 * Promise helper to save duplicated RedisClient code.
 * @param {function} resolve 
 * @param {function} reject 
 * @param {function|undefined} A function to verify a Redis response with.
 */
const promiseHelper = (resolve, reject, cb) => (
    (err, res) => (err || cb && cb(res)) ? reject(err) : resolve(res)
)

class RedisStrategy extends BaseStrategy
{
    static isValid() {
        return 'REDIS_URL' in process.env
    }

    static get name() {
        return 'Redis'
    }

    constructor() {
        super()
        this.redisClient = redis.createClient(process.env.REDIS_URL, {
            detect_buffers: true
        })
    }

    has(key) {
        return new Promise((resolve, reject) => {
            this.redisClient.exists(
                key,
                // Provided no error, we want to reject when no key is found (res 0).
                promiseHelper(resolve, reject, res => res === 0)
            )
        })
    }
    
    get(key) {
        return new Promise((resolve, reject) => {
            return this.redisClient.get(new Buffer(key), promiseHelper(resolve, reject))
        })
    }

    set(key, value) {
        return new Promise((resolve, reject) => {
            this.redisClient.set(key, value, promiseHelper(resolve, reject))
        })
    }

    delete(key) {
        return new Promise((resolve, reject) => {
            this.redisClient.del(key, promiseHelper(resolve, reject))
        })
    }
}

module.exports = RedisStrategy