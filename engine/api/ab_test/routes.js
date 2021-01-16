'use strict'

const express = require('express')
const logger = require('../../common/logger')
const SubscriptionManager = require('../../subscriptionManager')

/**
 * A/B testing middleware and routes, serves routeA, then routeB
 * will have future functionality to end test
 * @param {String} routeA the relative path to a index.html file
 * @param {String} routeB the relative path to another index.html file
 * @returns {Router}
**/ 
module.exports = (routeA, routeB) => {
  const router = express.Router()
  const subscriptionManager = new SubscriptionManager()
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

  router.post('/subscribe', (req, res) => {
    logger.info('/subscribe')
    logger.info(req.body)
    let pageVersion = req.body.page_version
    pageVersion = pageVersion ? pageVersion.toLowerCase() : undefined

    if (pageVersion && (pageVersion === 'a' || pageVersion === 'b')) {
      logger.info(`new subscription from page ${pageVersion}`) 
      subscriptionManager.add(pageVersion)
      return res.sendStatus(201)
    }
    else {
      logger.info('page_version must be "a" or "b"')
      return res.sendStatus(400)
    }
  })

  router.post('/unsubscribe', (req, res) => {
    logger.info('/unsubscribe')
    subscriptionManager.unsubscribe()
    res.sendStatus(204)
  })

  router.get('/unsubscriptions', (req, res) => {
    logger.info('/unsubscriptions')
    res.status(200).json(subscriptionManager.getUnsubscriptions())
  })

  return router
}
