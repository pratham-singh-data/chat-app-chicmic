const { sign, } = require('jsonwebtoken');
const { SECRETKEY, } = require('../../config');
const { hashPassword, } = require('../helpers/hashPassword');
const { generateLocalSendResponse,
    sendResponse, } = require('../helpers/responder');
const { findOneInUsers,
    saveDocumentInUsers,
    saveDocumentInTokens,
    findManyFromUsers, } = require('../services');
const { TOKENEXPIRYTIME, TOKENTYPES, } = require('../util/constants');
const { EMAILALREADYREGISTERED,
    USERSUCCESSFULLYREGISTERRED,
    CREDENTIALSNOTVEFIFIED,
    USERSUCCESSFULLOGIN, } = require('../util/messages');

/** Signs up new user in database
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function signupUser(req, res, next) {
    const localResponder = generateLocalSendResponse(res);
    const body = req.body;
    body.password = hashPassword(body.password);

    try {
        // confirm that email is unique
        if (await findOneInUsers({
            email: body.email,
        })) {
            localResponder({
                statusCode: 403,
                message: EMAILALREADYREGISTERED,
            });

            return;
        }

        const savedData = await saveDocumentInUsers(body);

        const token = sign({
            id: savedData._id,
        }, SECRETKEY, {
            expiresIn: TOKENEXPIRYTIME.LOGIN,
        });

        await saveDocumentInTokens({
            user: savedData._id,
            token,
            tokenType: TOKENTYPES.LOGIN,
        });

        localResponder({
            statusCode: 201,
            message: USERSUCCESSFULLYREGISTERRED,
            token,
            savedData,
        });
    } catch (err) {
        next(err);
    }
}

/** Logs in an user in database
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function loginUser(req, res, next) {
    const localResponder = generateLocalSendResponse(res);
    const body = req.body;
    body.password = hashPassword(body.password);

    try {
        const userData = await findOneInUsers(body);

        if (! userData) {
            localResponder({
                statusCode: 400,
                message: CREDENTIALSNOTVEFIFIED,
            });

            return;
        }

        const token = sign({
            id: userData._id,
        }, SECRETKEY, {
            expiresIn: TOKENEXPIRYTIME.LOGIN,
        });

        await saveDocumentInTokens({
            user: userData._id,
            token,
            tokenType: TOKENTYPES.LOGIN,
        });

        localResponder({
            statusCode: 200,
            message: USERSUCCESSFULLOGIN,
            token,
        });
    } catch (err) {
        next(err);
    }
}

/** Function to list all existing users in the database
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function listUsers(req, res, next) {
    try {
        sendResponse(res, {
            statusCode: 200,
            data: await findManyFromUsers({}, {
                _id: true,
                name: true,
            }),
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    signupUser,
    loginUser,
    listUsers,
};
