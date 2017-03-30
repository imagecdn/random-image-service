const fetch = require('isomorphic-fetch')
const {_redirect} = require('./util')

// Skeleton Query used for search.
const getQuery = query => ({
    category: 'buildings',
    size: {
        width: 1920,
        height: 1200
    }
})

// Format.  Redirect is "default" for BC.
const getFormat = format => {
    switch (format) {
        case 'json':
            return 'json'
            break

        case 'redirect':
        default:
            return 'redirect'
            break
    }
}

module.exports = function image(req, res, next) {

    const query = getQuery(req.query.query)
    const format = getFormat(req.query.format)

    fetch(`https://source.unsplash.com/category/${query.category}/${query.size.width}x${query.size.height}`)
        .then(res => res.url)
        .then(url => {
            res.setHeader('Cache-Control', 'no-cache')
            switch(format) {
                case 'json':
                    res.json({
                        provider: 'unsplash',
                        license: 'CC0',
                        terms: 'https://unsplash.com/terms',
                        url
                    })
                    break

                case 'redirect':
                    _redirect(res, url)
                    break
            }
        })
        .catch(err => next(err))
}