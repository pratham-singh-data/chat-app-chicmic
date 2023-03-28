const { io, } = require('socket.io-client');
const { PORT, } = require('../../config');
const { generateLocalSendResponse,
    sendResponse, } = require('../helpers/responder');
const { saveDocumentInChatrooms,
    saveDocumentInMessages,
    findFromChatroomsById,
    updateChatroomById,
    findInMessages,
    findFromMessagesById,
    updateMessagesById,
    deleteFromMessagesById, } = require('../services');
const { findFromUsersById, } = require('../services/userServices');
const { NON_EXISTENT_USER,
    DATA_SUCCESSFULLY_CREATED,
    PARTNER_CANNOT_BE_SELF,
    NON_PARTICIPANT_USER,
    NON_EXISTENT_CHATROOM,
    NON_EXISTENT_MESSAGE,
    MESSAGE_DOES_NOT_BELONG,
    DATA_SUCCESSFULLY_UPDATED,
    DATA_SUCCESSFULLY_DELETED, } = require('../util/messages');

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

/** Sends message in a chatroom
 * @param {Request} req Express request object\
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function sendMessage(req, res, next) {
    const localResponder = generateLocalSendResponse(res);
    const token = req.headers.token;
    const body = req.body;

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

        // generate data
        body.sender = token.id;
        body.chatroom = req.params.id;
        body.text = body.message;
        delete body.message;

        const savedData = await saveDocumentInMessages(body);

        // send data to socket
        const socket = io(`http://localhost:${PORT}`);
        socket.emit(`simple_message`, savedData.text, savedData.chatroom);

        // register in chatroom
        updateChatroomById(req.params.id, {
            $push: {
                messages: savedData._id,
            },
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

/** Updates message in a chatroom
 * @param {Request} req Express request object\
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function updateMessage(req, res, next) {
    const localResponder = generateLocalSendResponse(res);
    const token = req.headers.token;
    const body = req.body;

    try {
        // get data of message
        const messageData = await findFromMessagesById(req.params.id);

        if (! messageData) {
            localResponder({
                statusCode: 404,
                message: NON_EXISTENT_MESSAGE,
            });

            return;
        }

        // if current user is not the sender then do not update
        if (String(messageData.sender) !== token.id) {
            localResponder({
                statusCode: 403,
                message: MESSAGE_DOES_NOT_BELONG,
            });

            return;
        }

        updateMessagesById(req.params.id, {
            $set: {
                text: body.message,
            },
        });

        // send data to socket
        const socket = io(`http://localhost:${PORT}`);
        socket.emit(`updated_message`,
            {
                id: req.params.id,
                message: body.message,
            },
            messageData.chatroom);

        return localResponder({
            statusCode: 200,
            message: DATA_SUCCESSFULLY_UPDATED,
        });
    } catch (err) {
        return next(err);
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

/** Deletes message in a chatroom
 * @param {Request} req Express request object\
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function deleteMessage(req, res, next) {
    const localResponder = generateLocalSendResponse(res);
    const token = req.headers.token;

    try {
        // get data of message
        const messageData = await findFromMessagesById(req.params.id);

        if (! messageData) {
            localResponder({
                statusCode: 404,
                message: NON_EXISTENT_MESSAGE,
            });

            return;
        }

        // if current user is not the sender then do not delete
        if (String(messageData.sender) !== token.id) {
            localResponder({
                statusCode: 403,
                message: MESSAGE_DOES_NOT_BELONG,
            });

            return;
        }

        await deleteFromMessagesById(req.params.id);
        // deleted messages will remain in messages array of chatroom
        // to tell which messages have been deleted

        // send data to socket
        const socket = io(`http://localhost:${PORT}`);
        socket.emit(`deleted_message`, req.params.id, messageData.chatroom);

        return localResponder({
            statusCode: 200,
            message: DATA_SUCCESSFULLY_DELETED,
        });
    } catch (err) {
        return next(err);
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
    sendMessage,
    listMessage,
    updateMessage,
    deleteMessage,
    readChatroom,
};
