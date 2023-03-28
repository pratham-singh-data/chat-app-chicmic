const Joi = require('joi');
const { STRING_LENGTH_MIN, STRING_LENGTH_MAX, } = require('../util/constants');
const passwordComplexity = require(`joi-password-complexity`);

const loginSchema = Joi.object({
    email: Joi.string().
        min(STRING_LENGTH_MIN).
        max(STRING_LENGTH_MAX.NORMAL).
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
