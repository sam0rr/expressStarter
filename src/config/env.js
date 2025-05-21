const dotenv = require('dotenv');
dotenv.config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    appName: process.env.APP_NAME || 'ExpressStarter',
    apiPrefix: process.env.API_PREFIX || '/api',
    connectionString: process.env.CONNECTION_STRING
        || `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mongo:27017/${process.env.DB_NAME}?authSource=admin`
};

module.exports = config;
