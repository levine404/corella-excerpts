// Demonstrates my unique way of handling routes based on filename
// This makes it easier than explicitly loading a route every time one is created

// Imports
const { readdirSync, statSync } = require('fs')
const { resolve } = require('path')

// POST, GET, DELETE, PUT
const { appMethods } = require('../config/app.config')

// Custome middleware
const guardRoute = require('../middleware/guard-route.middleware')
const verifyTokenData = require('../middleware/verify-token-data.middleware')
const manageUploads = require('../middleware/manage-uploads.middleware')

// Load routes for express to process by loading type based on folder/filename
// In addition, load middleware to process each route
const loadDynamicRoutes = app => {
  const routesDir = '../routes'
  readdirSync(resolve(__dirname, routesDir)).forEach(dir => {
    const routeName = dir
    if (statSync(resolve(__dirname, routesDir, dir)).isDirectory()) {
      readdirSync(resolve(__dirname, routesDir, dir)).forEach(file => {
        const routePattern = `^${dir}.*.route.js$`
        const methodPattern = appMethods.join('|')
        const methodMatch = file.match(methodPattern)
        const method = methodMatch ? methodMatch[0] : null
        if (file.match(routePattern) !== null && method) {
          const routePath = resolve(__dirname, routesDir, dir, file)
          const routeHandler = require(routePath)

          // Configure route based on data from folder/filename
          app[method](
            `/${routeName}`,
            verifyTokenData,
            guardRoute,
            manageUploads(routeName, file),
            routeHandler
          )
        }
      })
    }
  })
}

module.exports = loadDynamicRoutes
