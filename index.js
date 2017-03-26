const {send, sendError} = require('micro')
const fetch = require('isomorphic-fetch')

module.exports = (req, res) => {
  fetch('https://source.unsplash.com/category/buildings/1920x1200')
    .then(imgRes => {
      res.setHeader('Location', imgRes.url)      
      send(res, 302, imgRes.url)
    })
    .catch(err => sendError(req, res, err))
}
