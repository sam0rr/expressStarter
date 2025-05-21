const express = require('express');
const config = require('./config/env');
const { connectToMongo } = require('./config/mongo');
const { setupRoutes } = require('./interfaces/routes');

const app = express();
app.use(express.json());

connectToMongo().then(() => {
    setupRoutes(app);

    app.listen(config.port, () => {
        console.log(`${config.appName} running at http://localhost:${config.port}`);
    });
}).catch((err) => {
    console.error('Failed to start application:', err);
});
