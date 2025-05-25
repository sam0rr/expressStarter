const express = require('express');
const router = express.Router();

const kryptlokCtrl = require('../../controllers/KryptLokController');
const { MongooseAjvValidator } = require('../../validator/MongooseAjvValidator');
const KryptlokTransaction = require('../../models/KryptlokTransaction');

const validator = new MongooseAjvValidator(KryptlokTransaction);

router.post(
    '/',
    validator.validateBody().only('from', 'to', 'amount', 'previousHash'),
    kryptlokCtrl.create
);

router.get(
    '/',
    kryptlokCtrl.findAll
);

module.exports = router;
