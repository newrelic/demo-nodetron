'use strict'

const express = require('express')
const logger = require('../../logger')

/**
 * A/B testing middleware and routes, serves routeA, then routeB
 * will have future functionality to end test
 * @param {String} routeA the relative path to a index.html file
 * @param {String} routeB the relative path to another index.html file
 * @returns {Router}
**/ 
module.exports = (routeA, routeB) => {
  const router = express.Router()
  let isRouteANext = true
  router.use((req, res, next) => {
    if (req.url !== '/') return next()
    
    const currentRoute = isRouteANext ? routeA : routeB
    logger.info(req.url)
    logger.info(`serving ${currentRoute}`)

    res.append('X-PAGE-VERSION', isRouteANext ? 'A' : 'B')
    req.url = currentRoute
    isRouteANext = !isRouteANext

    next()
  })

  return router
}
