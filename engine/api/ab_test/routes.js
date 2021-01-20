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
module.exports = (appConfig, routeA, routeB) => {
  const router = express.Router()
  const subscriptionManager = new SubscriptionManager(appConfig)
  const authValue = appConfig.getAuthString()
  let isTestRunning = true
  let currentRoute = routeA

  if (typeof authValue !== 'string') {
    throw new Error('authString must be a string')
  }

  router.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`)
    next()
  })

  router.use((req, res, next) => {
    if (req.url !== '/') return next()
   
    if (isTestRunning) {
      currentRoute = currentRoute === routeA ? routeB : routeA
    }
    else {
      logger.info('Test ended, serving a')
    }

    logger.info(`serving ${currentRoute}`)
    req.url = currentRoute
    next()
  })

  router.post('/subscribe', (req, res) => {
    const pageVersion = req.body.page_version

    if (checkPageVersion(pageVersion)) {
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
    subscriptionManager.unsubscribe()
    res.sendStatus(204)
  })

  router.use('/unsubscriptions', authMiddleware(authValue))
  router.get('/unsubscriptions', (req, res) => {
    res.status(200).json(subscriptionManager.getUnsubscriptions())
  })

  router.use('/end-test', authMiddleware(authValue))
  router.post('/end-test', (req, res) => {
    const pageVersion = req.query.page_version

    if (checkPageVersion(pageVersion) && isTestRunning) {
      currentRoute = pageVersion.toLowerCase() === 'a' ? routeA : routeB
      isTestRunning = false       
      logger.info(`Test ended, serving version "${pageVersion}" on all requests`)
      return res.sendStatus(200)
    }
    res.sendStatus(400)
  })

  return router
}

function checkPageVersion(value) {
  if (value && typeof value === 'string') {
    const lowerValue = value.toLowerCase()
    if (lowerValue === 'a' || lowerValue === 'b') {
      return true
    }
  }

  return false
}

function authMiddleware(value) {
  return (req, res, next) => {
    const auth = req.get('Authorization')
    if (auth && auth === value) {
      return next() 
    }

    res.sendStatus(401)
  }
}
