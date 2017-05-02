// Default options for this middleware.
const defaultOptions = {
    allowQueryOverride: true
}

// Format.  Redirect is "default" for BC.
const getFormatFromQuery = format => {
    switch (format) {
        case 'json':
            return 'json'

        case 'txt':
        case 'text':
            return 'text'

        case 'image':
        default:
            return 'image'
    }
}

const getFormatFromRequest = req => {

    switch (true) {
        case Boolean(req.is('image/*')):
        case req.headers.accept.startsWith('image/'):
            return 'image'

        case Boolean(req.is('json')):
        case /^application\/json$/.test(req.headers.accept):
            return 'json'

        default:
            return 'text'
    }
}

function requestFormat(options) {
    const config = Object.assign(options || {}, defaultOptions)
    const allowQueryOverride = config.allowQueryOverride

    return (req, res, next) => {

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