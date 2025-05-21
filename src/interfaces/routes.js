const {homeController} = require("./controllers/homeController");

function setupRoutes(app) {
    app.get('/home', homeController);
}

module.exports = { setupRoutes };
