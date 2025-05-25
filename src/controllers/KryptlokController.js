const KryptlokService = require('../services/KryptLokService');
const BaseController = require('./utils/BaseController');
const bindAllMethods = require('../utils/controllers/bindAllMethods');

class KryptlokController extends BaseController {
    constructor() {
        super();
        bindAllMethods(this);
    }

    async create(req, res) {
        const transaction = await KryptlokService.createTransaction(req.body);
        this.sendCreated(res, transaction);
    }

    async findAll(req, res) {
        const transactions = await KryptlokService.getAll();
        this.sendSuccess(res, transactions);
    }
}

module.exports = new KryptlokController();
