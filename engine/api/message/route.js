'use strict';

module.exports = function(app) {
    var controller = require('./controller');

    app.route('/api/validateMessage').get(controller.validateMessage)
};

