const mongoose = require('mongoose');
const EncryptionService = require('../services/EncryptionService');

const ADDRESS_PATTERN = /^[A-Fa-f0-9]{64}$/;

const kryptLokTransactionSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true,
        match: ADDRESS_PATTERN
    },
    to: {
        type: String,
        required: true,
        match: ADDRESS_PATTERN
    },
    amount: {
        type: Number,
        required: true,
        min: 0.000001
    },
    currency: {
        type: String,
        default: 'KLC'
    },
    previousHash: {
        type: String,
        required: true,
        match: /^[A-Fa-f0-9]{64}$/
    },
    hash: {
        type: String,
        unique: true,
        match: /^[A-Fa-f0-9]{64}$/
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

kryptLokTransactionSchema.pre('validate', function (next) {
    if (!this.hash) {
        const payload = `${this.from}:${this.to}:${this.amount}:${this.previousHash}:${this.createdAt}`;
        this.hash = EncryptionService.hash256(payload);
    }
    next();
});

module.exports = mongoose.model('KryptLokTransaction', kryptLokTransactionSchema);
