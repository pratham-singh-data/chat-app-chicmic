const Joi = require('joi');
const { STRINGLENGTHMIN, STRINGLENGTHMAX, } = require('../util/constants');
const passwordComplexity = require(`joi-password-complexity`);

const loginSchema = Joi.object({
    email: Joi.string().
        min(STRINGLENGTHMIN).
        max(STRINGLENGTHMAX.NORMAL).
        email().
        required(),
    password: passwordComplexity({
        min: 8,
        max: 20,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: Infinity,
    }).required(),
});

module.exports = {
    loginSchema,
};
