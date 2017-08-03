const fetch = require('isomorphic-fetch')
const ProgressivePair = require('pson').ProgressivePair

const encoder = new ProgressivePair([])
const nextResponse = new Map()

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


function cachedImageAction(req, res, next) {

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

    // If we already have a response with this key, send that response.
    if (nextResponse.has(query.hash)) {
        const response = nextResponse.get(query.hash)
        nextResponse.delete(query.hash)
        sendResponse(response)
    }

    return getImageFromProvider(query)
        // If this query is cacheable, store it for a future request.
        .then(responseBody => {
            if (req.cacheable !== false) nextResponse.set(query.hash, responseBody)
            return responseBody
        })
        .then(sendResponse)
        .catch(err => next(err))
}

function imageAction(res, req, next) {
    req.cacheable = false
    return cachedImageAction(res, req, next)
}

module.exports = {cachedImageAction,imageAction}