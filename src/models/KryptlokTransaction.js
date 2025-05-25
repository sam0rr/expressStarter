const mongoose = require('mongoose');
const EncryptionService = require('../services/Encryption/EncryptionService');

const ADDRESS_PATTERN = /^[A-Fa-f0-9]{40}$/;
const HASH_PATTERN    = /^[A-Fa-f0-9]{64}$/;

const schema = new mongoose.Schema({
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
        match: HASH_PATTERN
    },
    hash: {
        type: String,
        unique: true,
        match: HASH_PATTERN
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

schema.pre('validate', function (next) {
    if (!this.hash) {
        const payload = `${this.from}:${this.to}:${this.amount}:${this.previousHash}:${this.createdAt}`;
        this.hash = EncryptionService.hash(payload, 'sha256');
    }
    next();
});

module.exports = mongoose.models.kryptlokTransaction
    ? mongoose.model('kryptlokTransaction')
    : mongoose.model('kryptlokTransaction', schema);
