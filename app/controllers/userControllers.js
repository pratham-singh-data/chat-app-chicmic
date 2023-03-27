const { sign, } = require('jsonwebtoken');
const { SECRETKEY, } = require('../../config');
const { hashPassword, } = require('../helpers/hashPassword');
const { generateLocalSendResponse,
    sendResponse, } = require('../helpers/responder');
const { findOneInUsers,
    saveDocumentInUsers,
    saveDocumentInTokens,
    updateUserById,
    runAggregateOnUsers,
    findFromUsersById, } = require('../services');
const { TOKENEXPIRYTIME, TOKENTYPES, } = require('../util/constants');
const { EMAILALREADYREGISTERED,
    USERSUCCESSFULLYREGISTERRED,
    CREDENTIALSNOTVEFIFIED,
    USERSUCCESSFULLOGIN,
    DATASUCCESSFULLYUPDATED, } = require('../util/messages');

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
            expiresIn: TOKENEXPIRYTIME.TEMP,
        });

        await saveDocumentInTokens({
            user: savedData._id,
            token,
            tokenType: TOKENTYPES.TEMP,
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
        const userData = await findOneInUsers({
            ...body,
            emailValidated: true,
        });

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
            data: await runAggregateOnUsers([
                {
                    $skip: req.query.skip,
                },

                {
                    $limit: req.query.limit,
                },

                {
                    $match: {
                        _id: {
                            $ne: req.headers.token.id,
                        },
                    },
                },

                {
                    $project: {
                        name: true,
                    },
                },
            ]),
        });
    } catch (err) {
        next(err);
    }
}

/** Updates user data
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function updateUser(req, res, next) {
    const localResponder = generateLocalSendResponse(res);
    const token = req.headers.token;
    const body = req.body;

    try {
        // get data of current user
        const userData = await findFromUsersById(token.id);

        // check if user is trying to update email
        if (userData.email !== body.email) {
            // check that email is unique
            if (await findOneInUsers({
                email: body.email,
            })) {
                localResponder({
                    statusCode: 403,
                    message: EMAILALREADYREGISTERED,
                });

                return;
            }

            // create and send a temp token
            const jwtToken = sign({
                id: token.id,
                email: body.email,
                oldEmail: userData.email,
            }, SECRETKEY, {
                expiresIn: TOKENEXPIRYTIME.TEMP,
            });

            // remove email from data being updated
            delete body.email;

            // update user data but also mark email as not validated
            await updateUserById(token.id, {
                $set: {
                    ...body,
                    password: hashPassword(body.password),
                },
            });

            await saveDocumentInTokens({
                user: token.id,
                token: jwtToken,
                tokenType: TOKENTYPES.TEMP,
            });

            localResponder({
                statusCode: 200,
                message: DATASUCCESSFULLYUPDATED,
                token: jwtToken,
            });
        } else {
            await updateUserById(token.id, {
                $set: {
                    ...body,
                    password: hashPassword(body.password),
                },
            });

            localResponder({
                statusCode: 200,
                message: DATASUCCESSFULLYUPDATED,
            });
        }

        // will never reach here
    } catch (err) {
        next(new Error(err));
    }
}

/** Validates a user's email
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function validateUserEmail(req, res, next) {
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

        await updateUserById(userData._id, {
            $set: {
                emailValidated: true,
            },
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

module.exports = {
    signupUser,
    loginUser,
    listUsers,
    validateUserEmail,
    updateUser,
};
