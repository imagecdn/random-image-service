const { Router } = require('express')

const defaultOptions = {
    healthchecks: []
}
const model = {
    version: 1,
    healthchecks: [],
    ok: true,
    status: 'OK'
}

function healthcheck(opts) {
    const options = Object.assign(defaultOptions, opts || {})
    const router = new Router()

    const healthchecks = options.healthchecks.map(check => check())
    return router.all('/__health', (req, res) =>
        Promise.all(healthchecks)
            .then(healthchecks =>
                res.status(200).json(Object.assign({healthchecks}, model))
            )
            .catch(err =>
                res.status(500).json(Object.assign(model, {status: err.message, ok: false}))
            )
    )
}

module.exports = healthcheck