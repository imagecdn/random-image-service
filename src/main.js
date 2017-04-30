const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const router = express.Router()

const image = require('./routes/image')
const requestFormat = require('./middleware/request-format')

app.use(cors())
app.use(bodyParser.json())

app.use(requestFormat())

router.get('/v1/image', image)
router.get('/__health', (req, res) => {
  res.json({status:'OK'})
})
router.get('/*', (req, res) => {
  res.redirect('https://responsiveimages.io/')
})

app.use(router)
const listener = app.listen(process.env.PORT || 3000, _ => {
    const {address,port} = listener.address()
    console.log(`Serving on ${address} ${port}.`)
})
