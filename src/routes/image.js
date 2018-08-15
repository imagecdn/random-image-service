const msgpack = require('msgpack-lite')
const cache = require('../cache')
const providers = require('../provider')

const noop = _ => (undefined)

// Skeleton Query used for search.
class Query {
    constructor(params) {
        this.category = params.category || 'buildings'
        this.bucket = `random-${Math.floor(Math.random()*10)}-v1`
        this.provider = params.provider || 'unsplash'
        this.size = {
            width: params.width || 1920,
            height: params.height || 1200
        }
    }

    get hash() {
        return `${this.category}-${this.bucket}-${this.provider}-${this.size.width}x${this.size.height}`
    }
}

function getImageFromProvider(query) {
    if (Object.keys(providers).includes(query.provider)) {
        const provider = new providers[query.provider](query)
        return provider.randomImage(query)
    }
    throw new Error("Unknown provider.")
}

function imageAction(req, res, next) {

    // Define logic for sending a response.
    const sendResponse = responseBody => {

        req.log(JSON.stringify(responseBody))

        // Bail if we've already served this response.
        if (res.headersSent) return

        // We don't want clients to cache this response.
        res.setHeader('Cache-Control', 'no-cache')
        switch (req.format) {

            // Text response is the URL.
            case 'text':
                res.send(responseBody.url)
                break

            // We redirect for images.
            case 'image':
            case 'redirect':
                res.redirect(responseBody.url)
                break

            // JSON format is the entire response body.
            case 'json':
                res.json(responseBody)
                break

            default:
                throw new Error('Unexpected Content-Type')
        }
    }

    // Grab query from request, and generate a hash for caching.
    const query = new Query(Object.assign(req.params, req.query))
    req.log(JSON.stringify(query.hash))

    // A massive promise chain, so we can access asynch caches.
    // If we already have a response with this key, send that response.
    return cache.has(query.hash)
        .then(_ => cache.get(query.hash))
        .then(msgpack.decode)
        .then(sendResponse)
        .then(_ => cache.delete(query.hash))
        .catch(noop)

        // Perform our Provider callout.
        .then(_ => getImageFromProvider(query))
        .then(responseBody => {
            if (req.cacheable !== false) cache.set(query.hash, msgpack.encode(responseBody))
            return responseBody
        })

        // Send response.
        .then(sendResponse)

        .catch(err => {
            req.log(err)
            next(err)
        })
}

module.exports = imageAction