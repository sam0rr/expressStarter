// src/services/UserService.js
const BaseService        = require('./utils/BaseService');
const UserModel          = require('../models/User');
const WalletService      = require('./WalletService');
const EncryptionService  = require('./Encryption/EncryptionService');
const AppError           = require('../errors/AppError');
const { StatusCodes }    = require('http-status-codes');

class UserService extends BaseService {
    constructor() {
        super(UserModel);
    }

    async registerUser(data) {
        data.password = await EncryptionService.hashPassword(data.password);
        return this._generateUserData(data);
    }

    async login({ email, password }) {
        const user = await this.findOne({ email });
        return await this._verfiyUserAuth(password, user);
    }

    async updateUserById(id, data) {
        if (data.password) {
            data.password = await EncryptionService.hashPassword(data.password);
        }
        return this.updateOne({ _id: id }, data);
    }

    async getUserById(id) {
        return this.findOne({ _id: id });
    }

    async getAllUsers() {
        return this.findAll();
    }

    async deleteUserById(id) {
        await this.deleteOne({ _id: id });
    }

    async _generateUserData(data) {
        const saltHex    = EncryptionService.generateSalt();
        const userKey    = EncryptionService.deriveUserKey(data.password, saltHex);

        const pubKey     = EncryptionService.generatePublicKey(userKey);

        const sha256     = EncryptionService.hash(pubKey, 'sha256');
        const walletAddr = EncryptionService.hashRIPEMD160(Buffer.from(sha256, 'hex'));

        data.walletAddress = walletAddr;
        const user = await this.create(data);

        await WalletService.create({ address: walletAddr, balance: 0 });

        return user;
    }

    async _verfiyUserAuth(password, user) {
        const valid = await EncryptionService.verifyPassword(password, user.password);

        if (!valid) {
            throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);
        }

        return user;
    }
}

module.exports = new UserService();
