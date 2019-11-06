// Use authentication processing with passport.js

const loadPassportRoutes = app => {
  require('../routes/passport/facebook.routes')(app)
  require('../routes/passport/local.routes')(app)
  require('../routes/passport/jwt-provider.route')(app)
}

module.exports = loadPassportRoutes
