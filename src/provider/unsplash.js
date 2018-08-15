const BaseProvider = require('./base-provider')
const fetch = require('isomorphic-fetch')

class Unsplash extends BaseProvider
{
    constructor(provider) {
        super(provider)
        this._defaultResponseBody.provider = 'unsplash'
        this._defaultResponseBody.license = 'CC0'
        this._defaultResponseBody.terms = 'https://unsplash.com/terms'
    }

    randomImage(query) {
        return fetch(`https://source.unsplash.com/category/${query.category}/${query.size.width}x${query.size.height}`)
        .then(res => this._normalizeResponse({
            url: res.url,
            size: query.size
        }))
    }
}

module.exports = Unsplash