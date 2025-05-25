const BaseService = require('./utils/BaseService');
const WalletModel = require('../models/Wallet');

class WalletService extends BaseService {
    constructor() {
        super(WalletModel);
    }

    async getBalance(address) {
        const wallet = await this.findOne({ address });
        return wallet.balance;
    }

    async applyTransaction({ from, to, amount }) {
        await this.updateOne(
            { address: from },
            { $inc: { balance: -amount } }
        );
        await this.updateOne(
            { address: to },
            { $inc: { balance: amount } }
        );
    }
}

module.exports = new WalletService();
