const BaseController = require('./BaseController');
const userService    = require('../services/userService');

class UserController extends BaseController {
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
}

module.exports = new UserController();
