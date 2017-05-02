const { Router } = require('express')

const defaultOptions = {
    healthchecks: []
}
const model = {
    version: 1,
    healthchecks: [],
    ok: true
}

function healthcheck(opts) {
    const options = Object.assign(opts || {}, defaultOptions)
    const router = new Router()

    return router.all('/__health', (req, res) => (
        Promise.all(options.healthchecks.map(healthcheck))
            .then(healthchecks => res.json(Object.assign({healthchecks}, model)))
            .catch(err => res.json(Object.assign(model, {err, ok: false})))
    ))
}

module.exports = healthcheck