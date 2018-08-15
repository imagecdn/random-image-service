
const providers = {
    'custom-v1': require('./custom-v1'),
    s3: require('./s3'),
    unsplash: require('./unsplash')
}

module.exports = {
    providers,
    defaultableProviders: Object.keys(providers).filter(providerName => providers[providerName].defaultable)
}