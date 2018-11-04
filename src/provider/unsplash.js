const fetch = require('isomorphic-fetch')
const BaseProvider = require('./base-provider')

class Unsplash extends BaseProvider
{
    constructor(provider) {
        super(provider)
        this._defaultResponseBody.provider = 'unsplash'
        this._defaultResponseBody.license = 'CC0'
        this._defaultResponseBody.terms = 'https://unsplash.com/terms'
    }

    static get defaultable() {
        return true
    }

    randomImage(query) {
        const height = query.size.height || 1080
        const width = query.size.width || 1920
        return fetch(`https://source.unsplash.com/category/${query.category}/${width}x${height}`)
        .then(res => this._normalizeResponse({
            url: res.url,
            size: {height, width}
        }))
    }
}

module.exports = Unsplash