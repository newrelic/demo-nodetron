'use strict'
require('dotenv').config()
const logger = require("./common/logger")

if (!newrelic) {
  try {
    var newrelic = require('newrelic')
  }
  catch (err) {
    logger.error('Unable to load New Relic Agent', err)
  }
}

const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  appConfig = require('./appConfig'),
  aBTestRoutes = require('./api/ab_test/routes')

logger.init()

if (process.argv.length<3) {
  logger.error(`a config file is expected, please run as: node ./server.js [path_to_config.json]`)
}
else {
  const configFilename = process.argv[2]
  const config = appConfig.createInstance(configFilename)

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  app.use(aBTestRoutes(config, '/a/index.html', '/b/index.html', newrelic))
  app.use('/', express.static('public'))

  app.use((err, req, res, next) => {
    logger.error(err.message)
    res.status(500).send(err.message)
    next(err)
  })

  const port = config.getPort() || 3001
  app.listen(port)

  logger.info(`server started on:${port}`)
}
