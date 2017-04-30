const fetch = require('isomorphic-fetch')

// Skeleton Query used for search.
const getQuery = query => ({
    category: 'buildings',
    size: {
        width: 1920,
        height: 1200
    }
})

module.exports = function image(req, res, next) {

    const query = getQuery(req.query.query)

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
                    const body = {
                        provider: 'unsplash',
                        license: 'CC0',
                        terms: 'https://unsplash.com/terms',
                        url: ''
                    }
                    res.json(Object.assign(body, {url}))
                    break

                default:
                    throw new Error('Unexpected Content-Type')
            }
        })
        .catch(err => next(err))
}