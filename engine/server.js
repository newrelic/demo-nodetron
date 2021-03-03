require('dotenv').config()
require("fs")
const logger = require("./lib/logger")

const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  appConfig = require('./lib/appConfig'),
  inventoryRepositoryFactory = require('./lib/inventoryRepositoryFactory')

logger.init()

if (process.argv.length<3){
  logger.error(`a config file is expected, please run as: node ./server.js [path_to_config.json]`)
}
else{
  const configFilename = process.argv[2]
  const config = appConfig.createInstance(configFilename)
  const inventoryRepository = inventoryRepositoryFactory(config)

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use('/', express.static('public'))
  app.use('/api', express.static('public'))

  const healthRoute = require('./api/health/route')
  healthRoute(app)

  const inventoryRoute = require('./api/inventory/route')
  inventoryRoute(app, inventoryRepository)

  const indexRoute = require('./api/index/route')
  indexRoute(app)

  const messageRoute = require('./api/message/route')
  messageRoute(app)

  const behaviorsRoute = require('./api/behaviors/route')
  behaviorsRoute(app)

  app.use(function (err, req, res, next) {
    logger.error(err.message)
    res.status(500).send(err.message)
    next(err)
  })

  const port = config.getPort()
  const appId = config.getAppId()
  app.listen(port)

  logger.info(`${appId} server started on:${port}`)
}
