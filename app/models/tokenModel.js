const { Schema, Types: { ObjectId, }, model, } = require('mongoose');
const { TOKEN_TYPES, } = require('../util/constants');

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
        default: TOKEN_TYPES.TEMP,
    },
}, {
    timestamps: true,
});

const TokenModel = model(`tokens`, tokenSchema);

module.exports = {
    TokenModel,
};
