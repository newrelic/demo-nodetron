'use strict';

module.exports = function(app, databaseManager) {
    const controller = require('./controller')

    app.route('/api/query').get(controller.executeQuery(databaseManager))
}
