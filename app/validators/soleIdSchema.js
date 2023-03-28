const Joi = require('joi');
const { OBJECTID_REGEX, } = require('../util/constants');

const soleIdSchema = Joi.object({
    id: Joi.string().regex(OBJECTID_REGEX).required(),
});

module.exports = {
    soleIdSchema,
};
