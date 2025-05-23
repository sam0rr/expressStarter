const BaseController = require('./BaseController');
const userService = require('../services/userService');
const bindAllMethods = require('../utils/controllers/bindAllMethods');

class UserController extends BaseController {
    constructor() {
        super();
        bindAllMethods(this);
    }

    async create(req, res) {
        const user = await userService.createUser(req.body);
        this.sendCreated(res, user);
    }

    async findAll(req, res) {
        const users = await userService.getAllUsers();
        this.sendSuccess(res, users);
    }

    async findById(req, res) {
        const user = await userService.getUserById(req.params.id);
        this.sendSuccess(res, user);
    }

    async update(req, res) {
        const user = await userService.updateUserById(req.params.id, req.body);
        this.sendUpdated(res, user);
    }

    async delete(req, res) {
        await userService.deleteUserById(req.params.id);
        this.sendDeleted(res);
    }
}

module.exports = new UserController();
