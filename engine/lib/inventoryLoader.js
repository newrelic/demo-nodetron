'use strict'
var logger = require("./logger")
const fileUtil = require("./fileUtil")

function inventoryLoader(inventoryFilename = "data/inventory.json", loaderFunc = fileUtil.readJsonFile) {
    logger.info(`Loading inventory with ${inventoryFilename}`)
    return loaderFunc(inventoryFilename)
}

module.exports = inventoryLoader
