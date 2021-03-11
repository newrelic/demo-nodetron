'use strict';
const behaviorRepository = require("../../lib/behaviors/repository")
const instance = new behaviorRepository()
const logger = require("../../lib/logger")

exports.getBehaviors = function(req, res, next) {
    logger.info('/behaviors', 'get')
    res.json(behaviorRepository.GetAvailableBehaviors())
    next()
};

const handleFunc = function(req, res, step) {
    const behaviors = instance.getByRequest(req, step)
    behaviors.forEach(behavior => {
        behavior.execute()
    });
};

exports.handlePreFunc = function(req, res) {
    handleFunc(req, res, "PRE")
};

exports.handlePostFunc = function(req, res) {
    handleFunc(req, res, "POST")
};
