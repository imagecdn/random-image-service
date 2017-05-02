const fetch = require('isomorphic-fetch')

// Skeleton Query used for search.
const getQuery = query => ({
    category: query.category || 'buildings',
    size: {
        width: query.width || 1920,
        height: query.height || 1200
    }
})

function image(req, res, next) {

    const query = getQuery(req.query)
    const body = {
        provider: 'unsplash',
        license: 'CC0',
        terms: 'https://unsplash.com/terms',
        url: ''
    }

    fetch(`https://source.unsplash.com/category/${query.category}/${query.size.width}x${query.size.height}`)
        .then(res => res.url)
        .then(url => {
            res.setHeader('Cache-Control', 'no-cache')
            switch (req.format) {
                case 'text':
                    res.send(url)
                    break

                case 'image':
                case 'redirect':
                    res.redirect(url)
                    break

                case 'json':
                    res.json(Object.assign(body, {url}))
                    break

                default:
                    throw new Error('Unexpected Content-Type')
            }
        })
        .catch(err => next(err))
}

module.exports = image