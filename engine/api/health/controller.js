'use strict';
const healthModules = require("../../health/modules")
const logger = require("../../lib/logger")
const appConfig = require("../../lib/appConfig")
const MySQLRepository = require("../../lib/mySQLRepository")

let instance = new healthModules()

exports.getHealth = function(req, res, next) {
    logger.info('/health', 'get')
    res.json(instance.get())
    next()
};

exports.getDatabaseHealth = function(req, res) {
    logger.info('/database/health', 'get')
    const config = appConfig.getInstance()
    const repo = MySQLRepository.getInstance(config.getMySQLConfiguration())
    if (repo && repo.isConnected()) {
        return res.sendStatus(200)
    }
    res.status(500).send({ error: "Not connected to a database." })
}
