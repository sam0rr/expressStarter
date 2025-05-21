const { getHomeMessage } = require('../services/homeService');

function homeController(req, res) {
    const message = getHomeMessage();
    res.json({ message });
}

module.exports = { homeController };
