const defaultResponseBody = {
    provider: '',
    license: '',
    terms: '',
    url: '',
    size: {
        width: 0,
        height: 0
    }
}

class BaseProvider {

    constructor(provider) {
        this._provider = provider
        this._defaultResponseBody = defaultResponseBody
    }

    _normalizeResponse(res) {
        return Object.assign(this._defaultResponseBody, res)
    }

    randomImage(query) {
        return new Promise((_, reject) => {
            reject(new Error("Not implemented!"))
        })
    }
}

module.exports = BaseProvider