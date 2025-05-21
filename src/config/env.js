const dotenv = require('dotenv');
dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    appName: process.env.APP_NAME || 'ExpressStarter',
    connectionString: process.env.CONNECTION_STRING
};

module.exports = config;
