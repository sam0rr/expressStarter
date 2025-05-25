const express = require('express');
const router  = express.Router();

const authCtrl = require('../../controllers/AuthController');
const { MongooseAjvValidator } = require('../../validator/MongooseAjvValidator');
const User     = require('../../models/User');

const validator = new MongooseAjvValidator(User);

router.post(
    '/register',
    validator.validateBody().only('name', 'email', 'password', 'age'),
    authCtrl.register
);

router.post(
    '/login',
    validator.validateBody().only('email', 'password'),
    authCtrl.login
);

module.exports = router;
