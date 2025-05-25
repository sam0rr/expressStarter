const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    address: { type: String, required: true, unique: true },
    balance: { type: Number, default: 500 }
});

const modelName = 'Wallet';
module.exports = mongoose.models[modelName]
    ? mongoose.model(modelName)
    : mongoose.model(modelName, walletSchema);
