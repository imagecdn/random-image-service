const test = require('ava')
const request = require('supertest')
const express = require('express')
const requestFormat = require('../../src/middleware/request-format')

// Load middleware, and allow Express to return it for all requests.
test.beforeEach(t => {
    const app = express()
    app.use(requestFormat(), (req, res) => res.json(req.format))
    t.context.request = request(app)
})

// Default to image.
test('It should return text', async t => {
    const res = await t.context.request.get('/')
    t.is(res.body, 'text')
})

// Accept headers.
test('Given an accept header of application/json it should return json', async t => {
    const res = await t.context.request.get('/').set('Accept', 'application/json')
    t.is(res.body, 'json')
})

test('Given an accept header of image/png it should return image', async t => {
    const res = await t.context.request.get('/').set('Accept', 'image/png')
    t.is(res.body, 'image')
})

test('Given an accept header of image/jpg it should return image', async t => {
    const res = await t.context.request.get('/').set('Accept', 'image/jpg')
    t.is(res.body, 'image')
})

test('Given an accept header of text/html it should return text', async t => {
    const res = await t.context.request.get('/').set('Accept', 'text/html')
    t.is(res.body, 'text')
})

test('Given an accept header of text/plain it should return text', async t => {
    const res = await t.context.request.get('/').set('Accept', 'text/plain')
    t.is(res.body, 'text')
})

// Content-Type headers.
test('Given a content-type header of application/json it should return json', async t => {
    const res = await t.context.request.get('/').set('Content-Type', 'application/json').send(" ")
    t.is(res.body, 'json')
})

test('Given a content-type header of image/png it should return image', async t => {
    const res = await t.context.request.get('/').set('Content-Type', 'image/png').send(" ")
    t.is(res.body, 'image')
})

test('Given a content-type header of image/jpg it should return image', async t => {
    const res = await t.context.request.get('/').set('Content-Type', 'image/jpg').send(" ")
    t.is(res.body, 'image')
})

test('Given a content-type header of text/html it should return text', async t => {
    const res = await t.context.request.get('/').set('Content-Type', 'text/html').send(" ")
    t.is(res.body, 'text')
})

test('Given a content-type header of text/plain it should return text', async t => {
    const res = await t.context.request.get('/').set('Content-Type', 'text/plain').send(" ")
    t.is(res.body, 'text')
})


// ?format query-string
test('Given an request with a format query-string of json it should return json', async t => {
    const res = await t.context.request.get('/?format=json')
    t.is(res.body, 'json')
})

test('Given an request with a format query-string of image it should return image', async t => {
    const res = await t.context.request.get('/?format=image')
    t.is(res.body, 'image')
})

test('Given an request with a format query-string of text it should return text', async t => {
    const res = await t.context.request.get('/?format=text')
    t.is(res.body, 'text')
})

test('Given an request with an invalid format query-string it should return image', async t => {
    const res = await t.context.request.get('/?format=test-phrase')
    t.is(res.body, 'image')
})

