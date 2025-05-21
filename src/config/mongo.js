const mongoose = require('mongoose');
const config = require('./env');

async function connectToMongo() {
    try {
        await mongoose.connect(config.connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
}

module.exports = { connectToMongo };
