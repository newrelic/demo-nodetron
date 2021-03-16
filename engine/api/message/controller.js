'use strict';
const logger = require("../../lib/logger")
const baseController = require("../baseController")
const tronResponse = require("../../lib/tronResponse")
const behaviorsController = require('../../api/behaviors/controller')

exports.validateMessage = async (httpRequest, httpResponse, next) => {
    try {
        baseController.ensureAppIsStarted()
        const message = httpRequest.query.message
        logger.info('/validateMessage', 'get', message)

        await behaviorsController.handlePreFunc(httpRequest, httpResponse)

        const data = { "result": true }
        const tron = new tronResponse()
        tron.setupDownStreamHeaders(httpRequest)
        await tron.executeDownstream(`/api/validateMessage?message=${message}`)

        await behaviorsController.handlePostFunc(httpRequest, httpResponse)
        tron.buildJsonResponse(httpResponse, data)
    }
    catch (error) {
        next(error)
    }
};
