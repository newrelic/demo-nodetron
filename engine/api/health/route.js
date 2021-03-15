'use strict';

module.exports = function(app) {
  var controller = require('./controller');

  app.route('/api/health')
    .get(controller.getHealth)

  app.route('/api/database/health')
     .get(controller.getDatabaseHealth)
};

