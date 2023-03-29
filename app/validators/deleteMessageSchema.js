const Joi = require('joi');
const { OBJECTID_REGEX, } = require('../util/constants');

const deleteMessageSchema = Joi.object({
    chatroom: Joi.string().regex(OBJECTID_REGEX).required(),
    messageId: Joi.string().regex(OBJECTID_REGEX).required(),
});

module.exports = {
    deleteMessageSchema,
};
