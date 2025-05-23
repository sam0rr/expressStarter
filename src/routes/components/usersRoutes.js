const express = require('express');
const router = express.Router();

const userCtrl = require('../../controllers/UserController');
const { MongooseJoiValidator } = require('../../validator/MongooseJoiValidator');
const User = require('../../models/User');

const validator = new MongooseJoiValidator(User);

router.post(
    '/',
    validator.validateBody(),
    userCtrl.create
);

router.post(
    '/update/:id',
    validator.validateAll(),
    userCtrl.update
);

router.delete(
    '/:id',
    validator.validateAll(),
    userCtrl.delete
);

router.get(
    '/',
    userCtrl.findAll
);

router.get(
    '/:id',
    validator.validateAll(['params']),
    userCtrl.findById
);

module.exports = router;
