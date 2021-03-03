'use strict'
var logger = require("./logger")
const inventoryLoader = require("./inventoryLoader")

class LocalStorageRepository {
    constructor(invLoader = inventoryLoader){
        this.inventory = null
        this.invLoader = invLoader
    }

    findAll(){
        logger.info(`Find all inventory`)
        return this.getInventory()
    }

    findOrNull(id){
        logger.info(`Find inventory item for id ${id}`)
        const inventory = this.getInventory()
        for (const index in inventory) {
          const item = inventory[index]
          if(item['id'] == id) {
            return item
          }
        }
        return null
    }

    getInventory(){
        if (this.inventory == null){
            this.inventory = this.invLoader.load()
        }
        return this.inventory
    }

}

module.exports = LocalStorageRepository
