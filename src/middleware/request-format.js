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

    switch (true) {
        case req.is('image/*'):
        case /^image/.test(req.headers.accept):
            return 'image'
            break

        case req.is('json'):
        case /^application\/json$/.test(req.headers.accept):
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
        console.log(getFormatFromRequest(req))
        return enrich(getFormatFromRequest(req))
    }
}

module.exports = requestFormat