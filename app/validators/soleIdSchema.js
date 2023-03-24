const Joi = require('joi');
const { OBJECTIDREGEX, } = require('../util/constants');

const soleIdSchema = Joi.object({
    id: Joi.string().regex(OBJECTIDREGEX).required(),
});

module.exports = {
    soleIdSchema,
};
