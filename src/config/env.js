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
        || `mongodb://${dbUser}:${dbPassword}@mongo:27017/${dbName}?authSource=admin`
};

module.exports = config;
