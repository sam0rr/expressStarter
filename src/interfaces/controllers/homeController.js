const { getHomeMessage } = require('../../application/homeService');

function homeController(req, res) {
    const message = getHomeMessage();
    res.json({ message });
}

module.exports = { homeController };
