const { generateLocalSendResponse,
    sendResponse, } = require('../helpers/responder');
const { saveDocumentInChatrooms,
    findFromChatroomsById,
    findInMessages, } = require('../services');
const { findFromUsersById, } = require('../services/userServices');
const { NON_EXISTENT_USER,
    DATA_SUCCESSFULLY_CREATED,
    PARTNER_CANNOT_BE_SELF,
    NON_PARTICIPANT_USER,
    NON_EXISTENT_CHATROOM, } = require('../util/messages');

/** Registers a chatroom
 * @param {Request} req Express request object\
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function registerRoom(req, res, next) {
    const localResponder = generateLocalSendResponse(res);
    const token = req.headers.token;
    const body = req.body;

    try {
        // confirm partner is a user that exists
        if (! await findFromUsersById(body.partner)) {
            localResponder({
                statusCode: 403,
                message: NON_EXISTENT_USER,
            });

            return;
        }

        // confirm that parner is not self
        if (body.partner === token.id) {
            localResponder({
                statusCode: 400,
                message: PARTNER_CANNOT_BE_SELF,
            });

            return;
        }

        const savedData = await saveDocumentInChatrooms({
            participant1: token.id,
            participant2: body.partner,
        });

        localResponder({
            statusCode: 200,
            message: DATA_SUCCESSFULLY_CREATED,
            savedData,
        });
    } catch (err) {
        next(err);
    }
}

/** List messages in a chatroom; id from params
 * @param {Request} req Express request object\
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function listMessage(req, res, next) {
    try {
        const data = await findInMessages({
            chatroom: req.params.id,
        });

        sendResponse(res, {
            statusCode: 200,
            data,
        });
    } catch (err) {
        next(err);
    }
}

/** Reads data of a chatroom
 * @param {Request} req Express request object\
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function readChatroom(req, res, next) {
    const localResponder = generateLocalSendResponse(res);
    const token = req.headers.token;

    try {
        // check if the current user is a participant in this
        // chatroom and that the chatroom exists
        const chatroomData = await findFromChatroomsById(req.params.id);

        if (! chatroomData) {
            localResponder({
                statusCode: 403,
                message: NON_EXISTENT_CHATROOM,
            });

            return;
        }

        if (String(chatroomData.participant1) !== token.id &&
                String(chatroomData.participant2) !== token.id) {
            localResponder({
                statusCode: 401,
                message: NON_PARTICIPANT_USER,
            });

            return;
        }

        sendResponse(res, {
            statusCode: 200,
            data: chatroomData,
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    registerRoom,
    listMessage,
    readChatroom,
};
