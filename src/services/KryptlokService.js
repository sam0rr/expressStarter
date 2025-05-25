const BaseService           = require('./utils/BaseService');
const KryptlokTransaction   = require('../models/KryptlokTransaction');
const WalletService         = require('./WalletService');

class KryptLokService extends BaseService {
    constructor() {
        super(KryptlokTransaction);
    }

    async createTransaction(data) {
        return await this._generateTransactionData(data);
    }

    async getAll() {
        return this.findAll();
    }

    async _generateTransactionData(data) {
        const {from, to, amount} = data;

        const last = await this.model.findOne().sort({createdAt: -1}).lean();
        const previousHash = last ? last.hash : '0'.repeat(64);

        let tx = await this.create({...data, previousHash, status: 'fail'});

        await WalletService.applyTransaction(from, to, amount);

        tx.status = 'success';
        await tx.save();
        return tx;
    }
}

module.exports = new KryptLokService();
