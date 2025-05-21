const UserModel = require('../models/User');

async function createUser({ name, email }) {
    const existing = await UserModel.findOne({ email });
    if (existing) {
        const error = new Error('User already exists');
        error.status = 400;
        throw error;
    }

    const user = new UserModel({ name, email });
    await user.save();
    return user;
}

async function getUserById(id) {
    const user = await UserModel.findById(id);
    if (!user) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
    }
    return user;
}

async function getAllUsers() {
    const users = await UserModel.find();
    if (!users) {
        const error = new Error('No users found');
        error.status = 404;
        throw error;
    }
    return users;
}

module.exports = { createUser, getUserById, getAllUsers };
