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
        trim: true
    },
    age: {
        type: Number,
        trim: true,
        min: 1,
        max: 150,
        default: 18
    },
    date: {
        date: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
