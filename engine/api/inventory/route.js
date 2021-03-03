'use strict'

module.exports = function(app, inventoryRepository) {
    var controller = require('./controller')

    app.route('/api/inventory').get(controller.getInventories(inventoryRepository))

    app.route('/api/inventory/:id').get(controller.getInventory(inventoryRepository))
};

