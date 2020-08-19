'use strict'
var logger = require("./logger")
const fileUtil = require("./fileUtil")

class IndexStore{
    constructor(indexFilename, loaderFunc = null){
        this.index = null
        this.indexFilename = indexFilename
        this.loaderFunc = loaderFunc || fileUtil.readJsonFile
    }

    findAll(){
        logger.info(`Find all indexes`)
        return this.getIndex()
    }

    getIndex(){
        if (this.index == null){
          logger.info(`Loading index with ${this.indexFilename}`)
          this.index = this.loaderFunc(this.indexFilename)
        }
        return this.index
    }

}

module.exports = IndexStore
