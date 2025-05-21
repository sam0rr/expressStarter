const express = require('express');
const config = require('./config/env');
const logger = require('./utils/logger');
const { connectToMongo } = require('./config/mongo');
const { setupRoutes } = require('./routes/setupRoutes');
const errorHandler = require('./utils/errorHandler');

const index = express();
index.use(express.json());

connectToMongo().then(() => {
    setupRoutes(index);

    index.use(errorHandler);

    index.listen(config.port, () => {
        logger.info(`${config.appName} running at http://localhost:${config.port}`);
    });
}).catch((err) => {
    logger.error('Failed to start application: ' + err.message);
    process.exit(1);
});
