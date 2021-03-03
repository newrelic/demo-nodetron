'use strict';
const appConfig = require('../lib/appConfig')

exports.ensureAppIsStarted = function() {
    var config = appConfig.getInstance()
    var delayStartMs = config.getDelayStartMs()
    if (delayStartMs > 0) {
        var currentProcessTimeMS = Math.floor((process.uptime()*1000))
        if (delayStartMs > currentProcessTimeMS) {
            var message = `The application is not yet ready to accept traffic`
            throw new Error(message)
        }
    }
};
