const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        trim: true,
        min: 1,
        max: 150
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 100,
        match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
    },
    walletAddress: {
        type: String,
        unique: true,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const modelName = 'User';
module.exports = mongoose.models[modelName]
    ? mongoose.model(modelName)
    : mongoose.model(modelName, userSchema);
