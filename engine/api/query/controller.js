'use strict';

const logger = require('../../lib/logger')
const baseController = require('../baseController')
const tronResponse = require('../../lib/tronResponse')

exports.executeQuery = function(databaseManager) {
  return function(httpRequest, httpResponse) {
    baseController.ensureAppIsStarted()
    logger.info('/query', 'get')
    const tron = new tronResponse()
    tron.setupDownStreamHeaders(httpRequest)

    databaseManager.query()
      .then(results => tron.buildJsonResponse(httpResponse, results))
      .catch(err => {
        logger.error('Unable to query database.', err)
        httpResponse.status(500).json({ message: "Error querying database" })
      })
  }
}

