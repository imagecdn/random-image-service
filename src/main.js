const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const router = new express.Router()

const image = require('./routes/image')
const requestFormat = require('./middleware/request-format')
const healthcheck = require('./middleware/health-check')

app.use(cors())
app.use(bodyParser.json())

app.use(requestFormat())

app.use(healthcheck())

router.get('/v1/image', image)
router.get('/*', (req, res) => {
  res.redirect('https://responsiveimages.io/')
})

app.use(router)
const listener = app.listen(process.env.PORT || 3000, err => {
    if (err) throw err
    const {address,port} = listener.address()
    console.log(`Serving on ${address} ${port}.`)
})