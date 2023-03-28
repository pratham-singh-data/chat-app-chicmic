const { verify, } = require('jsonwebtoken');
const { SECRET_KEY, } = require('../../config');
const { findOneInTokens, findFromUsersById, } = require('../services');
const { INVALID_TOKEN, NON_EXISTENT_USER, } = require('../util/messages');
const { generateLocalSendResponse, } = require('./responder');

/** Checks the token in response
 * @param {Array} types Types of token to accept
 * @return {Function} Middleware function to check token
 */
function checkToken(...types) {
    /** Middleware to check token
     * @param {Request} req Express request object
     * @param {Response} res Express response object
     * @param {Function} next Express next function
     */
    return async (req, res, next) => {
        const localResponder = generateLocalSendResponse(res);
        // check that a token was sent
        if (! req.headers.token) {
            localResponder({
                statusCode: 400,
                messsage: INVALID_TOKEN,
            });

            return;
        }

        // check that the token was generated by our system
        const tokenData = await findOneInTokens({
            token: req.headers.token,
        });

        if (! tokenData) {
            localResponder({
                statusCode: 400,
                message: INVALID_TOKEN,
            });

            return;
        }

        // check token type is valid
        if (! types.includes(tokenData.tokenType)) {
            localResponder({
                statusCode: 400,
                message: INVALID_TOKEN,
            });

            return;
        }

        // check that it is not verified and update token in header
        try {
            req.headers.token = verify(req.headers.token, SECRET_KEY);
        } catch (err) {
            localResponder({
                statusCode: 400,
                message: INVALID_TOKEN,
            });

            return;
        }

        // check the token belongs to a valid user
        if (! await findFromUsersById(req.headers.token.id)) {
            localResponder({
                statusCode: 400,
                message: NON_EXISTENT_USER,
            });

            return;
        }

        // if user reachers here then they are a valid user
        next();
    };
}

module.exports = {
    checkToken,
};
