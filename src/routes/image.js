const fetch = require('isomorphic-fetch')
const msgpack = require('msgpack-lite')
const cache = require('../cache')

// Skeleton Query used for search.
class Query {
    constructor(params) {
        this.category = params.category || 'buildings'
        this.bucket = `random-${Math.floor(Math.random()*4)}-v1`
        this.size = {
            width: params.width || 1920,
            height: params.height || 1200
        }
    }

    get hash() {
        return `${this.category}-${this.bucket}-${this.size.width}x${this.size.height}`
    }
}

const responseBody = {
    provider: 'unsplash',
    license: 'CC0',
    terms: 'https://unsplash.com/terms',
    url: '',
    size: {
        width: 0,
        height: 0
    }
}
const getResponseBody = res => Object.assign(responseBody, res)
const getImageFromProvider = query => (
    fetch(`https://source.unsplash.com/category/${query.category}/${query.size.width}x${query.size.height}`)
    .then(res => getResponseBody({
        url: res.url,
        size: query.size
    }))
)

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
        return
    }

    // Grab query from request, and generate a hash for caching.
    const query = new Query(Object.assign(req.params, req.query))
    req.log(JSON.stringify(query.hash))

    const log = function() {
        console.log(arguments)
        return arguments
    }

    // A massive promise chain, so we can access asynch caches.
    // If we already have a response with this key, send that response.
    return cache.has(query.hash)
        .then(_ => cache.get(query.hash))
        .then(msgpack.decode)
        .then(sendResponse)
        .then(_ => cache.delete(query.hash))
        .catch(_ => req.log('No variation found.'))

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