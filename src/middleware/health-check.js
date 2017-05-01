const { Router } = require('express')

const defaultOptions = {}
const model = {
    status: 'OK'
}

function healthcheck(opts) {
    const options = Object.assign(opts || {}, defaultOptions)

    return Router().all('/__health', (req, res) => {
        res.json(Object.assign({}, model))
    })
}

module.exports = healthcheck