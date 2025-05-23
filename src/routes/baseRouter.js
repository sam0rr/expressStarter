const express= require('express');
const fs= require('fs');
const path    = require('path');
const logger  = require('../utils/shared/logger');

const COMPONENTS_DIR      = 'components';
const ROUTE_FILE_SUFFIX   = 'Routes.js';
const WARN_INVALID_ROUTER = '{file} does not export a valid Express router';

function getRouteFiles(dir, suffix) {
    return fs.readdirSync(dir).filter(file => file.endsWith(suffix));
}

function isValidRouter(module) {
    return typeof module === 'function' || typeof module.use === 'function';
}

function loadRoutes(router, dir) {
    const files = getRouteFiles(dir, ROUTE_FILE_SUFFIX);
    files.forEach(file => {
        const modulePath  = path.join(dir, file);
        const routeModule = require(modulePath);

        if (!isValidRouter(routeModule)) {
            logger.warn(WARN_INVALID_ROUTER.replace('{file}', file));
            return;
        }

        const routeName = file.replace(ROUTE_FILE_SUFFIX, '').toLowerCase();
        const mountPath = `/${routeName}`;

        router.use(mountPath, routeModule);
        logger.info(`Mounted route [${mountPath}] from module ${file}`);
    });
}

function createRouter() {
    const router         = express.Router();
    const componentsPath = path.join(__dirname, COMPONENTS_DIR);
    loadRoutes(router, componentsPath);
    return router;
}

module.exports = createRouter();
