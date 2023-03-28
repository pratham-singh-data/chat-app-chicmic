const Joi = require('joi');
const { STRING_LENGTH_MIN, STRING_LENGTH_MAX, } = require('../util/constants');

const messageSchema = Joi.object({
    message: Joi.string().
        min(STRING_LENGTH_MIN).
        max(STRING_LENGTH_MAX.NORMAL).
        required(),
});

module.exports = {
    messageSchema,
};
