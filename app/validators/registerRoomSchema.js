const Joi = require('joi');
const { OBJECTIDREGEX, } = require('../util/constants');

const registerRoomSchema = Joi.object({
    partner: Joi.string().regex(OBJECTIDREGEX).required(),
});

module.exports = {
    registerRoomSchema,
};
