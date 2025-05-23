const BaseService = require('./BaseService');
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

        return this.updateById(id, user);
    }

    async getUserById(id) {
        return this.findById(id);
    }

    async getAllUsers() {
        return this.findAll();
    }

    async deleteUserById(id) {
        return this.deleteById(id);
    }
}

module.exports = new UserService();
