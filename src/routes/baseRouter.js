const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const routesPath = path.join(__dirname, 'components');

fs.readdirSync(routesPath).forEach((file) => {
    if (file.endsWith('Routes.js')) {
        const route = require(path.join(routesPath, file));
        if (typeof route !== 'function' && typeof route.use !== 'function') {
            console.warn(`[WARN] ${file} does not export a valid Express router`);
            return;
        }

        const routeName = file.replace('Routes.js', '').toLowerCase();
        router.use(`/${routeName}`, route);
    }
});

module.exports = router;
