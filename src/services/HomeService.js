const BaseService= require('./utils/BaseService');

class HomeService{
    getHomeMessage() {
        return 'Welcome to the Home endpoint!';
    }
}

module.exports = new HomeService();
