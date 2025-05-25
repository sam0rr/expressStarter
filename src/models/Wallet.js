const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    address: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 }
});

module.exports = mongoose.model('Wallet', walletSchema);
