'use strict';
var logger = require("../../logger")
const inventoryStore = require("../../inventoryStore")
const tronResponse = require("../../tronResponse")
var behaviorsController = require('../../api/behaviors/controller')

let instance = new inventoryStore("data/inventory.json")

exports.getInventories = function(httpRequest, httpResponse, next) {
    logger.info('/inventory', 'get')
    behaviorsController.handlePreFunc(httpRequest, httpResponse, function(){})
    var data = instance.findAll()
    var tron = new tronResponse()
    tron.setupDownStreamHeaders(httpRequest)
    tron.executeDownstream(`/api/inventory`)
    .then( () => {
        behaviorsController.handlePostFunc(httpRequest, httpResponse, function(){})
        tron.buildJsonResponse(httpResponse, data)
        next()
    })
    .catch( (error) => {
        next(error)
    })
};

exports.getInventory = function(httpRequest, httpResponse, next) {
    var id = httpRequest.params.id
    logger.info('/inventory', `/${id}`, 'get')
    behaviorsController.handlePreFunc(httpRequest, httpResponse, function(){})
    var data = instance.find(id)
    var tron = new tronResponse()
    tron.setupDownStreamHeaders(httpRequest)
    tron.executeDownstream(`/api/inventory/${id}`)
    .then( () => {
        behaviorsController.handlePostFunc(httpRequest, httpResponse, function(){})
        tron.buildJsonResponse(httpResponse, data)
        next()
    })
    .catch( (error) => {
        next(error)
    })
}
