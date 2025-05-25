const BaseService = require('./utils/BaseService');
const KryptLokTransactionModel = require('../models/KryptLokTransaction');
const WalletService = require('./WalletService');

class KryptLokService extends BaseService {
    constructor() {
        super(KryptLokTransactionModel);
    }

    async createTransaction(data) {
        const tx = await this.create(data);

        await WalletService.applyTransaction(data);

        return tx;
    }

    async getAll() {
        return this.findAll();
    }
}

module.exports = new KryptLokService();
