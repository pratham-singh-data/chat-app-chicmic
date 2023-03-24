const { sendResponse, } = require('../helpers/responder');

/** Handles error
 * @param {Error} err error object
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
function handleError(err, req, res, next) {
    sendResponse(res, {
        statusCode: 500,
        message: err.message,
    });
}

module.exports = {
    handleError,
};
