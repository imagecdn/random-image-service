module.exports._redirect = function _redirect(res, url) {
  res.setHeader('Location', url)
  res.status(302).send(url)
}