'use strict';
const logger = require("../../lib/logger")
const baseController = require("../baseController")
const tronResponse = require("../../lib/tronResponse")
const behaviorsController = require('../../api/behaviors/controller')

exports.validateMessage = function(httpRequest, httpResponse, next) {
    baseController.ensureAppIsStarted()
    const message = httpRequest.query.message
    logger.info('/validateMessage', 'get', message)
    behaviorsController.handlePreFunc(httpRequest, httpResponse)
    const data = { "result": true }
    const tron = new tronResponse()
    tron.setupDownStreamHeaders(httpRequest)
    tron.executeDownstream(`/api/validateMessage?message=${message}`)
    .then( () => {
        behaviorsController.handlePostFunc(httpRequest, httpResponse)
        tron.buildJsonResponse(httpResponse, data)
        next()
    })
    .catch( (error) => {
        next(error)
    })
};
