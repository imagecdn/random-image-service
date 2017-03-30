const express = require('express')
const cors = require('cors')
const fetch = require('isomorphic-fetch')
const app = express()
const image = require('./src/image')
const {_redirect} = require('./src/util')

app.use(cors())

app.get('/v1/image', image)

app.get('/__health', (req, res) => {
  res.json({status:'OK'})
})

app.get('/*', (req, res) => {
  _redirect(res, 'https://responsiveimages.io/')
})

app.listen(process.env.PORT || 3000)
