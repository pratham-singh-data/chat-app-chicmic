const Joi = require('joi');
const { sendResponse, } = require('../helpers/responder');

/** validates target
 * @param {String} target What to target for validation
 * @param {Object} schema Joi validation schema
 * @return {Function} Middleware function that validates via given schema
 */
function validator(target, schema) {
    /** Middleware to validate target
         * @param {Request} req Express request object
         * @param {Response} res Express response object
         * @param {Function} next Express next function
        */
    return (req, res, next) => {
        // validate and update request body
        try {
            req[target] = Joi.attempt(req[target], schema);
        } catch (err) {
            sendResponse(res, {
                statusCode: 400,
                message: err.message,
            });

            return;
        }

        // continue to next middleware
        next();
    };
}

/** validates body of request
 * @param {Object} schema Joi validation schema
 * @return {Function} Middleware function that validates via given schema
 */
function validateBody(schema) {
    return validator(`body`, schema);
}

/** validates query of request
 * @param {Object} schema Joi validation schema
 * @return {Function} Middleware function that validates via given schema
 */
function validateQuery(schema) {
    return validator(`query`, schema);
}

/** validates params of request
 * @param {Object} schema Joi validation schema
 * @return {Function} Middleware function that validates via given schema
 */
function validateParams(schema) {
    return validator(`params`, schema);
}

module.exports = {
    validateBody,
    validateQuery,
    validateParams,
};
