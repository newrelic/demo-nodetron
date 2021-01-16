'use strict'
var logger = require("./common/logger")
const fileUtil = require("./common/fileUtil")

var instance = null

class AppConfig{

    constructor(filename, loaderFunc = null){
        this.config = null
        this.filename = filename
        this.loaderFunc = loaderFunc || fileUtil.readJsonFile
    }

    static createInstance(filename, loaderFunc = null){
      instance = new AppConfig(filename, loaderFunc)
      return instance
    }

    static getInstance(){
      return instance
    }

    getPort(){
      const config = this.read()
      return config.port
    }

    // Other values like A/B weighting should be controlled here

    read(){
      if (this.config == null){
        logger.info(`Loading config with ${this.filename}`)
        this.config = this.loaderFunc(this.filename)
      }
      return this.config
    }

}

module.exports = AppConfig
