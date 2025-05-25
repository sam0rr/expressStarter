const BaseService    = require('./utils/BaseService');
const WalletModel    = require('../models/Wallet');
const AppError       = require('../errors/AppError');
const { StatusCodes } = require('http-status-codes');

class WalletService extends BaseService {
    constructor() {
        super(WalletModel);
    }

    async getBalance(address) {
        const w = await this.findOne({ address });
        return w.balance;
    }

    async debit(address, amount, options = {}) {
        const result = await this.model.updateOne(
            { address, balance: { $gte: amount } },
            { $inc: { balance: -amount } },
            options
        );

        if (result.matchedCount === 0) {
            throw new AppError(
                `Insufficient funds in wallet ${address}`,
                StatusCodes.BAD_REQUEST
            );
        }

        return result;
    }

    async credit(address, amount, options = {}) {
        return this.model.updateOne(
            { address },
            { $inc: { balance: amount } },
            options
        );
    }
}

module.exports = new WalletService();
