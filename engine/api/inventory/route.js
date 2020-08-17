'use strict';

module.exports = function(app) {
    var controller = require('./controller');

    app.route('/api/inventory').get(controller.getInventories)

    app.route('/api/inventory/:id').get(controller.getInventory)
};

