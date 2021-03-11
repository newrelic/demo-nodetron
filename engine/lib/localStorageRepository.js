'use strict'
const logger = require("./logger")
const fileUtil = require("./fileUtil")

class LocalStorageRepository {
    constructor(invLoader = () => fileUtil.readJsonFile('data/inventory.json')) {
        this.inventory = null
        this.invLoader = invLoader
    }

    findAll() {
        logger.info(`Find all inventory`)
        return this.getInventory()
    }

    findOrNull(id) {
        logger.info(`Find inventory item for id ${id}`)
        const inventory = this.getInventory()
        return inventory.find((item) => item.id === id) || null
    }

    getInventory() {
        if (this.inventory == null) {
            this.inventory = this.invLoader()
        }
        return this.inventory
    }

}

module.exports = LocalStorageRepository
