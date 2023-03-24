const Joi = require('joi');
const { STRINGLENGTHMIN, STRINGLENGTHMAX, } = require('../util/constants');

const messageSchema = Joi.object({
    message: Joi.string().
        min(STRINGLENGTHMIN).
        max(STRINGLENGTHMAX.NORMAL).
        required(),
});

module.exports = {
    messageSchema,
};
