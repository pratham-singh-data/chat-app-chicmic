const { sendResponse, } = require('../helpers/responder');
const { NONEXISTENTENDPOINT, } = require('../util/messages');

/** Handler for non existent endpoint being accessed
 * @param {Request} req Express request object
 */
function notFound(req) {
    sendResponse(req.res, {
        statusCode: 404,
        message: NONEXISTENTENDPOINT,
    });
}

module.exports = {
    notFound,
};
