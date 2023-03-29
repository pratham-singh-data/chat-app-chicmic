const Joi = require('joi');
const { objectIdValidator, } = require('../util/objectIdValidator');

const deleteMessageSchema = Joi.object({
    chatroom: Joi.string().custom(objectIdValidator).required(),
    messageId: Joi.string().custom(objectIdValidator).required(),
});

module.exports = {
    deleteMessageSchema,
};
