'use strict'
var logger = require("./logger")
const fileUtil = require("./fileUtil")

class InventoryStore{
    constructor(inventoryFilename, loaderFunc = null){
        this.inventory = null
        this.inventoryFilename = inventoryFilename
        this.loaderFunc = loaderFunc || fileUtil.readJsonFile
    }

    findAll(){
        logger.info(`Find all inventory`)
        return this.getInventory()
    }

    find(id){
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
          logger.info(`Loading inventory with ${this.inventoryFilename}`)
          this.inventory = this.loaderFunc(this.inventoryFilename)
        }
        return this.inventory
    }

}

module.exports = InventoryStore
