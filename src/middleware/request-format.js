const is = require('type-is')

// Default options for this middleware.
const defaultOptions = {
    allowQueryOverride: true
}

// Format.  Redirect is "default" for BC.
const getFormatFromQuery = format => {
    switch (format) {
        case 'json':
            return 'json'
            break

        case 'txt':
        case 'text':
            return 'text'
            break

        case 'image':
        default:
            return 'image'
            break
    }
}

const getFormatFromRequest = req => {

    // Leverage content-type header for the meantime.
    req.headers['content-type'] = req.headers['content-type'] || req.headers['accept']

    switch (true) {
        case is(req, ['image/*']) !== false:
            return 'image'
            break

        case is(req, ['application/json']) !== false:
            return 'json'
            break

        default:
            return 'text'
    }
}

function requestFormat(options) {
    const config = Object.assign(options || {}, defaultOptions)
    const allowQueryOverride = config.allowQueryOverride

    return function requestFormatMiddleware(req, res, next) {

        const enrich = format => {
            req.format = format
            next()
        }

        if (allowQueryOverride && req.query.format) {
            return enrich(getFormatFromQuery(req.query.format))
        }
        return enrich(getFormatFromRequest(req))
    }
}

module.exports = requestFormat