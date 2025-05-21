const mongoose = require('mongoose');
const config = require('./env');
const logger = require('../utils/logger');

async function connectToMongo() {
    try {
        await mongoose.connect(config.connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        logger.info('Connected to MongoDB');
    } catch (err) {
        logger.error(`MongoDB connection error: ${err.message}`);
        process.exit(1);
    }
}

module.exports = { connectToMongo };
