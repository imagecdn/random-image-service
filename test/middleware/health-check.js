const test = require('ava')
const request = require('supertest')
const express = require('express')
const healthCheck = require('../../src/middleware/health-check')

// Load middleware, and allow Express to return it for all requests.
test.beforeEach(t => {
    const app = express()
    app.use(healthCheck())
    t.context.request = request(app)
})

// Check that health-check returns OK.
test('It should return OK', async t => {
    const res = await t.context.request.get('/__health')
    t.is(res.status, 200)
    t.is(res.body.ok, true)
    t.is(res.body.status, 'OK')
})

test('Given a failing healthcheck it should not return OK', async t => {
    const app = express()
    app.use(healthCheck({
        healthchecks: [
            _ => {
                return new Promise((resolve, reject) => {
                    reject(new Error("Error"))
                })
            }
        ]
    }))

    const res = await request(app).get('/__health')
    t.is(res.status, 500)
    t.is(res.body.ok, false)
    t.is(res.body.status, 'Error')
})