const Joi = require('joi');
const { sendResponse, } = require('../helpers/responder');

/** validates body of request
 * @param {Object} schema Joi validation schema
 * @return {Function} Middleware function that validates via given schema
 */
function validateBody(schema) {
    /** Middleware to validate body
     * @param {Request} req Express request object
     * @param {Response} res Express response object
     * @param {Function} next Express next function
     */
    return (req, res, next) => {
        // validate and update request body
        try {
            req.body = Joi.attempt(req.body, schema);
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

module.exports = {
    validateBody,
};
