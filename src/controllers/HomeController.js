const BaseController = require('./BaseController');
const homeService    = require('../services/homeService');

class HomeController extends BaseController {
    home(req, res) {
        const message = homeService.getHomeMessage();
        this.sendSuccess(res, { message });
    }
}

module.exports = new HomeController();
