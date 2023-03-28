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
const { TOKEN_EXPIRY_TIME, TOKEN_TYPES, } = require('../util/constants');
const { EMAIL_ALREADY_REGISTERED,
    USER_SUCCESSFULLY_REGISTERRED,
    CREDENTIALS_NOT_VEFIFIED,
    USER_SUCCESSFUL_LOGIN,
    DATA_SUCCESSFULLY_UPDATED, } = require('../util/messages');

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
                message: EMAIL_ALREADY_REGISTERED,
            });

            return;
        }

        const savedData = await saveDocumentInUsers(body);

        const token = sign({
            id: savedData._id,
        }, SECRETKEY, {
            expiresIn: TOKEN_EXPIRY_TIME.TEMP,
        });

        await saveDocumentInTokens({
            user: savedData._id,
            token,
            tokenType: TOKEN_TYPES.TEMP,
        });

        localResponder({
            statusCode: 201,
            message: USER_SUCCESSFULLY_REGISTERRED,
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
                message: CREDENTIALS_NOT_VEFIFIED,
            });

            return;
        }

        const token = sign({
            id: userData._id,
        }, SECRETKEY, {
            expiresIn: TOKEN_EXPIRY_TIME.LOGIN,
        });

        await saveDocumentInTokens({
            user: userData._id,
            token,
            tokenType: TOKEN_TYPES.LOGIN,
        });

        localResponder({
            statusCode: 200,
            message: USER_SUCCESSFUL_LOGIN,
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
                    message: EMAIL_ALREADY_REGISTERED,
                });

                return;
            }

            // create and send a temp token
            const jwtToken = sign({
                id: token.id,
                email: body.email,
                oldEmail: userData.email,
            }, SECRETKEY, {
                expiresIn: TOKEN_EXPIRY_TIME.TEMP,
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
                tokenType: TOKEN_TYPES.TEMP,
            });

            localResponder({
                statusCode: 200,
                message: DATA_SUCCESSFULLY_UPDATED,
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
                message: DATA_SUCCESSFULLY_UPDATED,
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
    const token = req.headers.token;
    body.password = hashPassword(body.password);

    try {
        let userData;

        if (token.oldEmail) {
            if (body.email !== token.email) {
                localResponder({
                    statusCode: 403,
                    message: CREDENTIALS_NOT_VEFIFIED,
                });

                return;
            }

            // update email token
            userData = await findOneInUsers({
                email: token.oldEmail,
                password: body.password,
            });
        } else {
            userData = await findOneInUsers(body);
        }

        if (! userData) {
            localResponder({
                statusCode: 400,
                message: CREDENTIALS_NOT_VEFIFIED,
            });

            return;
        }

        const jwtToken = sign({
            id: userData._id,
        }, SECRETKEY, {
            expiresIn: TOKEN_EXPIRY_TIME.LOGIN,
        });

        if (! token.oldEmail) {
            await updateUserById(userData._id, {
                $set: {
                    emailValidated: true,
                },
            });
        } else {
            await updateUserById(userData._id, {
                $set: {
                    email: token.email,
                    emailValidated: true,
                },
            });
        }

        await saveDocumentInTokens({
            user: userData._id,
            token: jwtToken,
            tokenType: TOKEN_TYPES.LOGIN,
        });

        localResponder({
            statusCode: 200,
            message: USER_SUCCESSFUL_LOGIN,
            token: jwtToken,
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
