'use strict'
const logger = require("../../lib/logger")
const baseController = require("../baseController")
const tronResponse = require("../../lib/tronResponse")
const behaviorsController = require('../../api/behaviors/controller')

exports.getInventories = (repo) => async (req, res, next) => {
    try {
        baseController.ensureAppIsStarted()
        logger.info('/inventory', 'get')

        behaviorsController.handlePreFunc(req, res)

        const data = await repo.findAll()
        const tron = new tronResponse()
        tron.setupDownStreamHeaders(req)
        tron.executeDownstream(`/api/inventory`)

        behaviorsController.handlePostFunc(req, res)

        tron.buildJsonResponse(res, data)
    }
    catch (err) {
        next(err)
    }
}

exports.getInventory = (repo) => async (req, res, next) => {
    try {
        baseController.ensureAppIsStarted()
        const id = req.params.id
        logger.info('/inventory', `/${id}`, 'get')

        behaviorsController.handlePreFunc(req, res)

        const data = await repo.findOrNull(id)
        const tron = new tronResponse()
        tron.setupDownStreamHeaders(req)
        await tron.executeDownstream(`/api/inventory/${id}`)

        behaviorsController.handlePostFunc(req, res)

        tron.buildJsonResponse(res, data)
    }
    catch (err) {
        next(err)
    }
}
