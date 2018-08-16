const BaseProvider = require('./base-provider')

class S3 extends BaseProvider
{
    randomImage() {
        throw new Error("Not implemented.")
    }
}

module.exports = S3