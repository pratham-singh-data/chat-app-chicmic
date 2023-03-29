const Joi = require('joi');
const { STRING_LENGTH_MIN,
    STRING_LENGTH_MAX, } = require('../util/constants');
const { objectIdValidator, } = require('../util/objectIdValidator');

const sendMessageSchema = Joi.object({
    chatroom: Joi.string().custom(objectIdValidator).required(),
    content: Joi.string().
        min(STRING_LENGTH_MIN).
        max(STRING_LENGTH_MAX.NORMAL).
        required(),
});

module.exports = {
    sendMessageSchema,
};
