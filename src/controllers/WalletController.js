const WalletService  = require('../services/WalletService');
const BaseController = require('./utils/BaseController');
const bindAllMethods = require('../utils/controllers/bindAllMethods');

class WalletController extends BaseController {
    constructor() {
        super();
        bindAllMethods(this);
    }

    async getBalance(req, res) {
        const balance = await WalletService.getBalance(req.params.address);
        this.sendSuccess(res, { address: req.params.address, balance });
    }
}

module.exports = new WalletController();
