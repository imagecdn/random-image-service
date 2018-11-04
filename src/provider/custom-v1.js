const fetch = require('isomorphic-fetch')
const Validator = require('jsonschema').Validator
const CustomV1Schema = require('../../schema/custom-v1.json')
const UrlSchema = require('../../schema/url.json')
const BaseProvider = require('./base-provider')

class CustomV1 extends BaseProvider
{
    randomImage(query) {
        const providerUrl = this._provider.substring(this._provider.indexOf(':')+1)
        return this.validateAndFetchProvider(providerUrl)
            .then(imagePool => this.imageFromPool(query, imagePool))
            .catch(err => { throw err })
    }

    validateAndFetchProvider(providerUrl) {
        const validator = new Validator()
        return new Promise((resolve, reject) => {
            if (validator.validate(providerUrl, UrlSchema).valid !== true) {
                reject(new Error("Invalid URL"))
            }

            fetch(providerUrl, {
                headers: {
                    Accept: "application/json"
                }
            })
            .then(res => res.json())
            .catch(err => {
                console.error(err)
                throw new Error("This is not a valid image pool!") 
            })
            .then(data => {
                if (
                    validator.validate(data, CustomV1Schema).valid !== true
                    || data.version !== 1
                ) {
                    reject(new Error("Invalid image pool!"))
                }
                resolve(data)
            })
            .catch(reject)
        })
    }

    imageFromPool(query, pool) {
        const image = pool.pictures[Math.floor(Math.random()*pool.pictures.length)]
        const imageServiceParams = []

        image.url = `https://imagecdn.app/v1/images/${encodeURIComponent(image.url)}`

        if (query.size) {
            if (query.size.width > 0) imageServiceParams.push(`width=${query.size.width}`)
            if (query.size.height > 0) imageServiceParams.push(`height=${query.size.height}`)
            image.url = `${image.url}?${imageServiceParams.join('&')}`
            image.size = query.size
        }

        return this._normalizeResponse(image)
    }
}

module.exports = CustomV1