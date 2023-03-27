const { verify, } = require('jsonwebtoken');
const { SECRETKEY, } = require('../../config');
const { generateLocalSendResponse, } = require('../helpers/responder');
const { findFromUsersById, findOneInTokens, } = require('../services');
const { VALIDTOKENNEEDED,
    CREDENTIALSCOULDNOTBEVERIFIED,
    INVALIDTOKENTYPE, } = require('../util/messages');

/** Returns a token checking middleware function
 * @param {Array} types array of types of token to validate
 * @return {Function} token validation function
 */
function checkToken(...types) {
    /** Checks token send by request
     * @param {Request} req Express request object
     * @param {Response} res Express response object
     * @param {Function} next Express next function
     */
    return async function(req, res, next) {
        const localResponder = generateLocalSendResponse(res);

        // check that token was sent
        if (! req.headers.token) {
            localResponder({
                statusCode: 403,
                message: VALIDTOKENNEEDED,
            });

            return;
        }

        const tokenData = await findOneInTokens({
            token: req.headers.token,
        });

        // check that token recieved was from your system
        if (! tokenData) {
            localResponder({
                statusCode: 403,
                message: VALIDTOKENNEEDED,
            });

            return;
        }

        // check that given is a login token
        if (! types.includes(tokenData.tokenType)) {
            localResponder({
                statusCode: 403,
                message: INVALIDTOKENTYPE,
            });

            return;
        }

        let id;

        try {
            ({ id, } = verify(req.headers.token, SECRETKEY));
        } catch (err) {
            localResponder({
                statusCode: 403,
                message: VALIDTOKENNEEDED,
            });

            return;
        }

        // confirm a corresponding user exists
        const userData = await findFromUsersById(id);

        if (! userData) {
            localResponder({
                statusCode: 403,
                message: CREDENTIALSCOULDNOTBEVERIFIED,
            });

            return;
        }

        // user is valid if they are here
        next();
    };
}

module.exports = {
    checkToken,
};
