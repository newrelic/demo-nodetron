'use strict'
var logger = require("./logger")
const fileUtil = require("./fileUtil")

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

    getAppId(){
        const config = this.read()
        return config.id
    }

    getPort(){
      const config = this.read()
      return config.port
    }

    getDelayStartMs(){
      const config = this.read()
      return config.delayStartMs
    }

    getDependencyEndpoint(endpoint){
      var dependencyEndpoints = []
      const config = this.read()
      config.dependencies.forEach(dependency => {
        const id = dependency.id
        const urls = dependency.urls
        logger.info(`Found dependency with id:${id} and urls:${urls}`)
        urls.forEach(url => {
          var dependencyEndpoint = url+endpoint
          dependencyEndpoints.push(dependencyEndpoint)
        })
      })
      return dependencyEndpoints
    }

    getMySQLConfiguration(){
      const config = this.read()
      const database = config.database

      if (database.user     &&
          database.password && 
          database.host     && 
          database.port     &&
          database.name
      ){
        return database
      }
    }
      
    read(){
      if (this.config == null){
        logger.info(`Loading config with ${this.filename}`)
        this.config = this.loaderFunc(this.filename)
      }
      return this.config
    }

}

module.exports = AppConfig
