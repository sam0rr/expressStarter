const BaseService = require('./utils/BaseService');
const UserModel = require('../models/User');
const EncryptionService = require('./Encryption/EncryptionService');

class UserService extends BaseService {
    constructor() {
        super(UserModel);
    }

    async createUser(data) {
        const user = { ...data };

        if (user.password) {
            user.password = await EncryptionService.hashPassword(user.password);
        }

        return this.create(user);
    }

    async updateUserById(id, data) {
        const user = { ...data };

        if (user.password) {
            user.password = await EncryptionService.hashPassword(user.password);
        }

        return this.updateOne(id, user);
    }

    async getUserById(id) {
        return this.findOne(id);
    }

    async getAllUsers() {
        return this.findAll();
    }

    async deleteUserById(id) {
        return this.deleteOne(id);
    }
}

module.exports = new UserService();
