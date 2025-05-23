const express = require('express');
const router = express.Router();

const userCtrl = require('../../controllers/UserController');
const userValidator = require('../../validators/userValidator');

router.post(
    '/',
    userValidator.validateUser,
    (req, res, next) => userCtrl.create(req, res, next)
);

router.post(
    '/update/:id',
    userValidator.validateUser,
    (req, res, next) => userCtrl.update(req, res, next)
)

router.delete(
    '/:id',
    (req, res, next) => userCtrl.delete(req, res, next)
)

router.get(
    '/',
    (req, res, next) => userCtrl.findAll(req, res, next)
);

router.get(
    '/:id',
    (req, res, next) => userCtrl.findById(req, res, next)
);

module.exports = router;
