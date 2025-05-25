const express = require('express');
const router = express.Router();

const walletCtrl = require('../../controllers/WalletController');
const { MongooseAjvValidator } = require('../../validator/MongooseAjvValidator');
const Wallet = require('../../models/Wallet');

const validator = new MongooseAjvValidator(Wallet);

router.get(
    '/:address',
    validator.validateParams().only('address'),
    walletCtrl.getBalance
);

module.exports = router;
