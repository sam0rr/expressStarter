const express = require('express');
const router = express.Router();

const homeCtrl = require('../../controllers/HomeController');

router.get(
    '/',
    (req, res, next) => homeCtrl.home(req, res, next));

module.exports = router;
