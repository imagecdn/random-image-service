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
router.get('/:width(\\d+)/:height(\\d+)', (req, res) => {
    const oneMonth = 28*24*60*60
    const cacheControl = [
        'public',
        `s-maxage=${oneMonth}`,
        `max-age=${oneMonth}`,
        'stale-while-revalidate=true',
        'stale-if-error=true'
    ]
    return res
        .set({'Cache-Control': cacheControl.join(', ')})
        .redirect(301, `/v1/image?width=${req.params.width}&height=${req.params.height}&format=redirect`)
})
router.get('/*', (req, res) => {
  res.redirect(404, '/v1/docs')
})

app.use(router)
const listener = app.listen(process.env.PORT || 3000, err => {
    if (err) throw err
    const {address,port} = listener.address()
    console.log(`Serving on ${address} ${port}.`)
})