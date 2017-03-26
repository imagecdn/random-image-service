const express = require('express')
const cors = require('cors')
const fetch = require('isomorphic-fetch')
const app = express()

app.use(cors())

app.get('/v1/image', (req, res, next) => {
  fetch('https://source.unsplash.com/category/buildings/1920x1200')
    .then(imgRes => _redirect(res, imgRes.url))
    .catch(err => next(err))
})

app.get('/__health', (req, res) => {
  res.json({status:'OK'})
})

app.get('/*', (req, res) => {
  _redirect(res, 'https://responsiveimages.io/')
})

const _redirect = (res, url) => {
  res.setHeader('Location', url)
  res.status(302).send(url)
}

app.listen(process.env.PORT || 3000)
