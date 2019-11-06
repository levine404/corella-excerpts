// Typical static routes served via express

const path = require('path')
const serveStatic = require('serve-static')

const loadStaticRoutes = app => {
  app.use(serveStatic(path.join(__dirname, '../../dist/spa')))
  app.use(serveStatic(path.join(__dirname, 'public')))
}

module.exports = loadStaticRoutes
