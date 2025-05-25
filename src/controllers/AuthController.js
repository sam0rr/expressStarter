const BaseController    = require('./utils/BaseController');
const bindAllMethods    = require('../utils/controllers/bindAllMethods');
const UserService       = require('../services/UserService');
const userService = require("../services/UserService");

class AuthController extends BaseController {
    constructor() {
        super();
        bindAllMethods(this);
    }

    async register(req, res) {
        const user = await userService.registerUser(req.body);
        this.sendCreated(res, user);
    }

    async login(req, res) {
        const { email, password } = req.body;
        const user = await UserService.login({ email, password });
        this.sendSuccess(res, user);
    }
}

module.exports = new AuthController();
