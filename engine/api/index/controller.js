'use strict';
const logger = require("../../lib/logger")
const indexStore = require("../../lib/indexStore")

let instance = new indexStore("data/index.json")

exports.getIndexes = function(httpRequest, httpResponse) {
    logger.info('/index', 'get')
    var data = instance.findAll()
    httpResponse.json(data)
};
