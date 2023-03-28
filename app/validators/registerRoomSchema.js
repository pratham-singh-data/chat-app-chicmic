const Joi = require('joi');
const { OBJECTID_REGEX, } = require('../util/constants');

const registerRoomSchema = Joi.object({
    partner: Joi.string().regex(OBJECTID_REGEX).required(),
});

module.exports = {
    registerRoomSchema,
};
