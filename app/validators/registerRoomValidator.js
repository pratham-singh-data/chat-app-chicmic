const Joi = require('joi');
const { OBJECTIDREGEX, } = require('../util/constants');

const registerRoomValidator = Joi.object({
    partner: Joi.string().regex(OBJECTIDREGEX).required(),
});

module.exports = {
    registerRoomValidator,
};
