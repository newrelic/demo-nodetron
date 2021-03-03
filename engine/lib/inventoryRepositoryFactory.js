'use strict'

const logger = require("./logger")
const MySQLRepository = require('./mySQLRepository')
const LocalStorageRepository = require('./localStorageRepository')

function inventoryRepositoryFactory(appConfig) {
    const mySQLConfig = appConfig.getMySQLConfiguration()
    if (mySQLConfig) {
        logger.info("MySQL configuration found, using MySQLRepository")
        return new MySQLRepository(appConfig.getAppId(), mySQLConfig)
    }
    else {
        logger.info("Using LocalStorageRepository")
        return new LocalStorageRepository()
    }
}

module.exports = inventoryRepositoryFactory
