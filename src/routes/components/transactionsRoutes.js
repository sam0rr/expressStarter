const express = require('express');
const router = express.Router();

const transactionsCtrl = require('../../controllers/TransactionsController');
const { MongooseAjvValidator } = require('../../validator/MongooseAjvValidator');
const KryptlokTransaction = require('../../models/KryptlokTransaction');

const validator = new MongooseAjvValidator(KryptlokTransaction);

router.post(
    '/',
    validator
        .validateBody()
        .only('from','to','amount')
        .strip('previousHash'),
transactionsCtrl.create
);

router.get(
    '/',
    transactionsCtrl.findAll
);

module.exports = router;
