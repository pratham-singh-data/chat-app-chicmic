const Joi = require('joi');
const { objectIdValidator, } = require('../util/objectIdValidator');

const registerRoomSchema = Joi.object({
    partner: Joi.string().custom(objectIdValidator).required(),
});

module.exports = {
    registerRoomSchema,
};
