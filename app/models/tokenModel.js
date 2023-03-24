const { Schema, Types: { ObjectId, }, model, } = require('mongoose');
const { TOKENTYPES, } = require('../util/constants');

const tokenSchema = new Schema({
    user: {
        type: ObjectId,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    tokenType: {
        type: Number,
        default: TOKENTYPES.TEMP,
    },
}, {
    timestamps: true,
});

const TokenModel = model(`tokens`, tokenSchema);

module.exports = {
    TokenModel,
};
