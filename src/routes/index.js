function index(req, res) {
  res.render('index', {
    title: 'Random Image API'
  })
}

module.exports = index