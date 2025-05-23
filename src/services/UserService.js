const BaseService = require('./BaseService');
const UserModel   = require('../models/User');

class UserService extends BaseService {
    constructor() {
        super(UserModel);
    }

    async createUser(data) {
        return this.create(data);
    }

    async getUserById(id) {
        return this.findById(id);
    }

    async getAllUsers() {
        return this.findAll();
    }

    async updateUserById(id, data) {
        return this.updateById(id, data);
    }

    async deleteUserById(id) {
        return this.deleteById(id);
    }
}

module.exports = new UserService();
