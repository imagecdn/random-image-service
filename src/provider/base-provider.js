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
        this._defaultResponseBody = Object.assign({}, defaultResponseBody)
    }

    static get defaultable() {
        return false
    }

    _normalizeResponse(res) {
        return Object.assign({}, this._defaultResponseBody, res)
    }

    randomImage() {
        return new Promise((resolve, reject) => {
            reject(new Error("Not implemented!"))
        })
    }
}

module.exports = BaseProvider