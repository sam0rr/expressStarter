const express = require('express');
const config = require('./config/env');
const logger = require('./utils/logger');
const { connectToMongo } = require('./config/mongo');
const { setupRoutes } = require('./routes');
const errorHandler = require('./utils/errorHandler');

const app = express();
app.use(express.json());

connectToMongo()
    .then(() => {
        setupRoutes(app);

        app.use(errorHandler);

        app.listen(config.port, () => {
            logger.info(`${config.appName} running at http://localhost:${config.port}`);
        });
    })
    .catch((err) => {
        logger.error('Failed to start application: ' + err.message);
        process.exit(1);
    });
