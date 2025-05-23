const BaseService= require('./BaseService');

class HomeService extends BaseService{
    getHomeMessage() {
        return 'Welcome to the Home endpoint!';
    }
}

module.exports = new HomeService(BaseService);
