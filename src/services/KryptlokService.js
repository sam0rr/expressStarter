const BaseService         = require('./utils/BaseService');
const KryptlokTransaction = require('../models/KryptlokTransaction');
const WalletService       = require('./WalletService');

class KryptLokService extends BaseService {
    constructor() {
        super(KryptlokTransaction);
    }

    async createTransaction(data) {
        const last = await this.model
            .findOne().sort({ createdAt: -1 }).lean();

        const previousHash = last ? last.hash : '0'.repeat(64);

        const tx = await this.create({ ...data, previousHash });

        await WalletService.debit(data.from, data.amount);

        return tx;
    }

    async getAll() {
        return this.findAll();
    }

    async processPendingForAddress(address) {
        const pendings = await this.model
            .find({ to: address, status: 'pending' })
            .select('amount')
            .lean();

        if (pendings.length === 0) return;

        const totalAmount = pendings.reduce((sum, { amount }) => sum + amount, 0);
        const ids = pendings.map(({ _id }) => _id);

        await this._withTransaction(async session => {
            await this.model.updateMany(
                { _id: { $in: ids } },
                { $set: { status: 'confirmed' } },
                { session }
            );
            await WalletService.credit(address, totalAmount, { session });
        });
    }

    async _withTransaction(fn) {
        const session = await this.model.db.startSession();
        session.startTransaction();
        try {
            const result = await fn(session);
            await session.commitTransaction();
            return result;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            await session.endSession();
        }
    }
}

module.exports = new KryptLokService();
