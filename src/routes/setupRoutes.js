const config = require('../config/env');
const baseRouter = require('./baseRouter');

function setupRoutes(app) {
    app.use(config.apiPrefix || '/api', baseRouter);
}

module.exports = { setupRoutes };
