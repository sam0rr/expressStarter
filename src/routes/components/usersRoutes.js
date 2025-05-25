const express = require('express');
const router = express.Router();

const userCtrl = require('../../controllers/UserController');
const { MongooseAjvValidator } = require('../../validator/MongooseAjvValidator');
const User = require('../../models/User');

const validator = new MongooseAjvValidator(User);

router.put('/:id',
    validator.validateParams().only('id'),
    validator.validateBody().optionalAll(),
    userCtrl.update
);

router.delete(
    '/:id',
    validator.validateParams().only('id'),
    userCtrl.delete
);

router.get(
    '/',
    userCtrl.findAll
);

router.get(
    '/:id',
    validator.validateParams().only('id'),
    userCtrl.findById
);

module.exports = router;
