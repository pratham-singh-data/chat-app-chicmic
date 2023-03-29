const Joi = require('joi');
const { OBJECTID_REGEX,
    STRING_LENGTH_MIN,
    STRING_LENGTH_MAX, } = require('../util/constants');

const sendMessageSchema = Joi.object({
    chatroom: Joi.string().regex(OBJECTID_REGEX).required(),
    content: Joi.string().
        min(STRING_LENGTH_MIN).
        max(STRING_LENGTH_MAX.NORMAL).
        required(),
});

module.exports = {
    sendMessageSchema,
};
