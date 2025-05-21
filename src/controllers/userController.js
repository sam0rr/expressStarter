const { createUser, getUserById, getAllUsers} = require('../services/userService');

async function createUserController(req, res) {
    const { name, email } = req.body;
    const user = await createUser({ name, email });
    res.status(201).json(user);
}

async function getUserByIdController(req, res) {
    const { id } = req.params;
    const user = await getUserById(id);
    res.status(200).json(user);
}

async function getAllUsersController(req, res) {
    const users = await getAllUsers();
    res.status(200).json(users);
}

module.exports = {
    createUserController,
    getUserByIdController,
    getAllUsersController
};
