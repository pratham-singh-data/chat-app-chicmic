const Joi = require('joi');
const { objectIdValidator, } = require('../util/objectIdValidator');

const soleIdSchema = Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
});

module.exports = {
    soleIdSchema,
};
