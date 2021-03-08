'use strict'
var logger = require("../../lib/logger")
const baseController = require("../baseController")
const tronResponse = require("../../lib/tronResponse")
var behaviorsController = require('../../api/behaviors/controller')


exports.getInventories = function(inventoryRepository) {
    return async function(httpRequest, httpResponse, next) {
        try {
            baseController.ensureAppIsStarted()
            logger.info('/inventory', 'get')
            behaviorsController.handlePreFunc(httpRequest, httpResponse, function() { })
            var data = await inventoryRepository.findAll()
            var tron = new tronResponse()
            tron.setupDownStreamHeaders(httpRequest)
            tron.executeDownstream(`/api/inventory`)
            behaviorsController.handlePostFunc(httpRequest, httpResponse, function() { })
            tron.buildJsonResponse(httpResponse, data)
        }
        catch (err) {
            next(err)
        }
    }
}

exports.getInventory = function(inventoryRepository) {
    return async function(httpRequest, httpResponse, next) {
        try {
            baseController.ensureAppIsStarted()
            var id = httpRequest.params.id
            logger.info('/inventory', `/${id}`, 'get')
            behaviorsController.handlePreFunc(httpRequest, httpResponse, function() { })
            var data = await inventoryRepository.findOrNull(id)
            var tron = new tronResponse()
            tron.setupDownStreamHeaders(httpRequest)
            await tron.executeDownstream(`/api/inventory/${id}`)
            behaviorsController.handlePostFunc(httpRequest, httpResponse, function() { })
            tron.buildJsonResponse(httpResponse, data)
        }
        catch (err) {
            next(err)
        }
    }
}
