'use strict';

const logger = require('../../logger')
const baseController = require('../baseController')
const tronResponse = require('../../tronResponse')

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

