const fetch = require('isomorphic-fetch')
const ProgressivePair = require('pson').ProgressivePair

const encoder = new ProgressivePair([])
const nextResponse = new Map()

// Skeleton Query used for search.

const getQueryFromParams = params => ({
    category: params.category || 'buildings',
    bucket: `random-${Math.floor(Math.random()*4)}-v1`,
    size: {
        width: params.width || 1920,
        height: params.height || 1200
    }
})

const responseBody = {
    provider: 'unsplash',
    license: 'CC0',
    terms: 'https://unsplash.com/terms',
    url: ''
}
const getResponseBodyFromUrl = url => Object.assign(responseBody, {url})
const getImageFromProvider = query => (
    fetch(`https://source.unsplash.com/category/${query.category}/${query.size.width}x${query.size.height}`)
        .then(res => getResponseBodyFromUrl(res.url))
)


function cachedImageAction(req, res, next) {

    // Define logic for sending a response.
    const sendResponse = responseBody => {

        // Bail if we've already served this response.
        if (res.headersSent) return

        req.log(JSON.stringify(responseBody))

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
    const paramsMergedWithQuery = Object.assign(req.params, req.query)
    const query = getQueryFromParams(paramsMergedWithQuery)
    const queryHash = encoder.encode(query).toString('hex')
    req.log(JSON.stringify(query))

    // If we already have a response with this key, send that response.
    if (nextResponse.has(queryHash)) {
        const response = nextResponse.get(queryHash)
        nextResponse.delete(queryHash)
        sendResponse(response)
    }

    return getImageFromProvider(query)
        // If this query is cacheable, store it for a future request.
        .then(responseBody => {
            if (req.cacheable !== false) nextResponse.set(queryHash, responseBody)
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