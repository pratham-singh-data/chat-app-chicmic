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
    emailValidated: {
        type: Boolean,
        default: false,
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

const UserModel = model(`users`, userSchema);

module.exports = {
    UserModel,
};
