const Joi = require('joi');

const paginationSchema = Joi.object({
    skip: Joi.number().integer().min(0).optional().default(0),
    limit: Joi.number().integer().min(0).optional().default(10),
});

module.exports = {
    paginationSchema,
};
