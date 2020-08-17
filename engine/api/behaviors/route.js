'use strict';

module.exports = function(app) {
    var controller = require('./controller');

    app.route('/api/behaviors').get(controller.getBehaviors)
};

