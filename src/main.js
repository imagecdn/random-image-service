const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const router = new express.Router()

const index = require('./routes/index')
const docs = require('./routes/docs')
const image = require('./routes/image')
const requestFormat = require('./middleware/request-format')
const healthcheck = require('./middleware/health-check')

app.engine('.html', expressHandlebars({
    extname: '.html',
    defaultLayout: 'main'
}))
app.set('view engine', '.html')

app.use(cors())
app.use(bodyParser.json())

app.use(requestFormat())

app.use(healthcheck())

router.get('/', index)
router.get('/v1/docs', docs)
router.get('/v1/image', image.cachedImageAction)
router.get('/*', (req, res) => {
  res.redirect('/v1/docs')
})

app.use(router)
const listener = app.listen(process.env.PORT || 3000, err => {
    if (err) throw err
    const {address,port} = listener.address()
    console.log(`Serving on ${address} ${port}.`)
})