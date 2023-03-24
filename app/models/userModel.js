const { Schema, model, } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    lastActive: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const userModel = model(`users`, userSchema);

module.exports = {
    userModel,
};
