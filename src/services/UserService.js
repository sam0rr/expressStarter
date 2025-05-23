const UserModel = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const AppError   = require('../errors/AppError');

class UserService {
    async createUser({ name, email }) {
        const exists = await UserModel.exists({ email });
        if (exists) {
            throw new AppError(
                'User already exists',
                StatusCodes.CONFLICT
            );
        }

        const user = new UserModel({ name, email });
        return await user.save();
    }

    async getUserById(id) {
        const user = await UserModel.findById(id).lean();
        if (!user) {
            throw new AppError(
                'User not found',
                StatusCodes.NOT_FOUND
            );
        }
        return user;
    }

    async getAllUsers() {
        return await UserModel.find().lean();
    }
}

module.exports = new UserService();
