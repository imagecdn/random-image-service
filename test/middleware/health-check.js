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
    t.is(res.body.status, 'OK')
})
