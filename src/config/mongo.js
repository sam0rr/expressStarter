const mongoose = require('mongoose');
const config = require('./env');
const logger = require('../utils/shared/logger');

async function connectToMongo() {
    try {
        await mongoose.connect(config.connectionString);

        logger.info('Connected to MongoDB');
    } catch (err) {
        logger.error(`MongoDB connection error: ${err.message}`);
        process.exit(1);
    }
}

module.exports = { connectToMongo };
