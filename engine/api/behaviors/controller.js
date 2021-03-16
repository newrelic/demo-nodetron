'use strict';
const behaviorRepository = require("../../lib/behaviors/repository")
const instance = new behaviorRepository()
const logger = require("../../lib/logger")

exports.getBehaviors = (req, res, next) => {
    logger.info('/behaviors', 'get')
    res.json(behaviorRepository.GetAvailableBehaviors())
    next()
};

const handleFunc = async (req, res, step) => {
    const behaviors = instance.getByRequest(req, step)

    for (const behavior of behaviors) {
        await behavior.execute()
    }
};

exports.handlePreFunc = async (req, res) => {
    await handleFunc(req, res, "PRE")
};

exports.handlePostFunc = async (req, res) => {
    await handleFunc(req, res, "POST")
};
