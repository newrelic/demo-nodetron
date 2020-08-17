'use strict';
var logger = require("../../logger")
const tronResponse = require("../../tronResponse")
var behaviorsController = require('../../api/behaviors/controller')

exports.validateMessage = function(httpRequest, httpResponse, next) {
    var message = httpRequest.query.message
    logger.info('/validateMessage', 'get', message)
    behaviorsController.handlePreFunc(httpRequest, httpResponse, function(){})
    var data = { "result": true }
    var tron = new tronResponse()
    tron.setupDownStreamHeaders(httpRequest)
    tron.executeDownstream(`/api/validateMessage?message=${message}`)
    .then( () => {
        behaviorsController.handlePostFunc(httpRequest, httpResponse, function(){})
        tron.buildJsonResponse(httpResponse, data)
        next()
    })
    .catch( (error) => {
        next(error)
    })
};
