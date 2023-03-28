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
    updateMessagesById, } = require('../services');
const { findFromUsersById, } = require('../services/userServices');
const { NONEXISTENTUSER,
    DATASUCCESSFULLYCREATED,
    PARTNERCANNOTBESELF,
    NONPARTICIPANTUSER,
    NONEXISTENTCHATROOM,
    NONEXISTENTMESSAGE,
    MESSAGEDOESNOTBELONG,
    DATASUCCESSFULLYUPDATED, } = require('../util/messages');

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
                message: NONEXISTENTUSER,
            });

            return;
        }

        // confirm that parner is not self
        if (body.partner === token.id) {
            localResponder({
                statusCode: 400,
                message: PARTNERCANNOTBESELF,
            });

            return;
        }

        const savedData = await saveDocumentInChatrooms({
            participant1: token.id,
            participant2: body.partner,
        });

        localResponder({
            statusCode: 200,
            message: DATASUCCESSFULLYCREATED,
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
        // chatroom and that the chatrrom exists
        const chatroomData = await findFromChatroomsById(req.params.id);

        if (! chatroomData) {
            localResponder({
                statusCode: 403,
                message: NONEXISTENTCHATROOM,
            });

            return;
        }

        if (String(chatroomData.participant1) !== token.id &&
                String(chatroomData.participant2) !== token.id) {
            localResponder({
                statusCode: 401,
                message: NONPARTICIPANTUSER,
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
            message: DATASUCCESSFULLYCREATED,
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
                message: NONEXISTENTMESSAGE,
            });

            return;
        }

        // if current user is not the sender then do not update
        if (String(messageData.sender) !== token.id) {
            localResponder({
                statusCode: 403,
                message: MESSAGEDOESNOTBELONG,
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
            message: DATASUCCESSFULLYUPDATED,
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

module.exports = {
    registerRoom,
    sendMessage,
    listMessage,
    updateMessage,
};
