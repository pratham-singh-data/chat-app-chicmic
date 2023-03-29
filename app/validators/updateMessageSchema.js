const Joi = require('joi');
const { OBJECTID_REGEX,
    STRING_LENGTH_MIN,
    STRING_LENGTH_MAX, } = require('../util/constants');

const updateMessageSchema = Joi.object({
    chatroom: Joi.string().regex(OBJECTID_REGEX).required(),
    content: Joi.string().
        min(STRING_LENGTH_MIN).
        max(STRING_LENGTH_MAX.NORMAL).
        required(),
    messageId: Joi.string().regex(OBJECTID_REGEX).required(),
});

module.exports = {
    updateMessageSchema,
};
