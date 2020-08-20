'use strict';
var logger = require("../../logger")
const indexStore = require("../../indexStore")

let instance = new indexStore("data/index.json")

exports.getIndexes = function(httpRequest, httpResponse, next) {
    logger.info('/index', 'get')
    var data = instance.findAll()
    httpResponse.json(data)
};
