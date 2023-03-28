const { sendResponse, } = require('../helpers/responder');
const { NON_EXISTENT_ENDPOINT, } = require('../util/messages');

/** Handler for non existent endpoint being accessed
 * @param {Request} req Express request object
 */
function notFound(req) {
    sendResponse(req.res, {
        statusCode: 404,
        message: NON_EXISTENT_ENDPOINT,
    });
}

module.exports = {
    notFound,
};
