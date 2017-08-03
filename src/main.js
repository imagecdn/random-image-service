const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const requestId = require('./middleware/request-id')
const requestFormat = require('./middleware/request-format')
const requestLogger = require('./middleware/request-logger')
const healthcheck = require('./middleware/health-check')
const index = require('./routes/index')
const docs = require('./routes/docs')
const image = require('./routes/image')
const imageShorthand = require('./routes/image-shorthand')
const logger = require('./util/logger')

const app = express()
const router = new express.Router()

app.engine('.html', expressHandlebars({
    extname: '.html',
    defaultLayout: 'main'
}))
app.set('view engine', '.html')

app.use(cors())
app.use(bodyParser.json())
app.use(requestId)
morgan.token('id', req => req.id)
app.use(morgan('[:id] :remote-addr :method :url', {
    immediate: true,
    stream: logger.stream
}))
app.use(requestLogger)
app.use(requestFormat())
app.use(healthcheck())
app.use(router)

router.get('/', index)
router.get('/v1/docs', docs)
router.get('/v1/image', image)
router.get('/:width(\\d+)/:height(\\d+)', imageShorthand)
router.get('/*', (req, res) => res.redirect('/v1/docs'))

const listener = app.listen(process.env.PORT || 3000, err => {
    if (err) throw err
    const {address,port} = listener.address()
    logger.info(`Serving on ${address} ${port}.`)
})