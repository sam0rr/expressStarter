const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const routesPath = path.join(__dirname, 'components');

fs.readdirSync(routesPath).forEach((file) => {
    if (file.endsWith('.js')) {
        const routeName = file.replace(/Routes\.js$/, '').toLowerCase();
        const route = require(path.join(routesPath, file));
        router.use(`/${routeName}`, route);
    }
});

module.exports = router;
