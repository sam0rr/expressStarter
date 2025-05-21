const express = require('express');
const {
    createUserController,
    getUserByIdController,
    getAllUsersController
} = require('../../controllers/userController');

const {
    validateCreateUser,
    validateUserId
} = require('../../validators/userValidator');

const router = express.Router();

router.post('/', validateCreateUser, createUserController);
router.get('/', getAllUsersController);
router.get('/:id', validateUserId, getUserByIdController);

module.exports = router;
