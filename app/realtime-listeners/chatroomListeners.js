const { verify, } = require('jsonwebtoken');
const { isValidObjectId, } = require('mongoose');
const { SECRET_KEY, } = require('../../config');
const { checkMessageUpdateValidity, } =
    require('../helpers/checkMessageUpdateValidity');
const { confirmChatroomValidity, } =
    require('../helpers/confirmChatroomValidity');
const { saveDocumentInMessages,
    updateMessagesById,
    updateChatroomById, } = require('../services');
const { NON_PARTICIPANT_USER,
    NON_EXISTENT_CHATROOM,
    INVALID_TOKEN,
    DATA_SUCCESSFULLY_CREATED,
    SUCCESSFULLY_SUBSCRIBED,
    INVALID_OPERATION,
    DATA_SUCCESSFULLY_UPDATED, } = require('../util/messages');

/** Subscribe the goiven socket to the given room
 * @param {Socket} socket Socket.io socket
 * @param {Object} sessionTokens Object conatining tokens in current session
 * @param {String} room Room to which current user should be subscribed
 * @param {Function} ack Acknowledgement Function
 */
async function subscribeSocket(socket, sessionTokens, room, ack) {
    // user is not registered if they
    // are not in the sessionTokens object
    if (! sessionTokens[socket.handshake.auth.token]) {
        ack(false, {
            message: INVALID_TOKEN,
        });
        return;
    }

    // check that room is valid
    if (! isValidObjectId(room)) {
        ack(false, {
            message: NON_EXISTENT_CHATROOM,
        });
        return;
    }

    // if token is in session tokens then it is assumed
    // that it belongs to a valid user
    // expiration is the only thing that is handled
    let token;

    try {
        token = verify(socket.handshake.auth.token, SECRET_KEY);
    } catch (err) {
        ack(false, {
            message: INVALID_TOKEN,
        });
        return;
    }

    const allowed = await confirmChatroomValidity(token, room);

    if (allowed) {
        socket.join(room);

        sessionTokens[socket.handshake.auth.token][room] = Date.now();
        console.log(sessionTokens);

        ack(true, {
            message: SUCCESSFULLY_SUBSCRIBED,
        });
    } else {
        ack(false, {
            message: NON_PARTICIPANT_USER,
        });
    }
}

/** Sends a message in this chatroom
 * @param {Socket} socket Socket.io socket
 * @param {Object} sessionTokens Object conatining tokens in current session
 * @param {Object} data Object with chatroom and content data
 * @param {Function} ack Acknowledgement function
 */
async function sendMessage(socket, sessionTokens, data, ack) {
    const { chatroom, content, } = data;
    const token = socket.handshake.auth.token;

    // if user is not sending a token stop
    if (! token || ! sessionTokens[token]) {
        ack(false, {
            message: INVALID_TOKEN,
        });
        return;
    }

    // check that the current user is in this chatroom
    if (! sessionTokens[token][chatroom]) {
        ack(false, {
            message: NON_PARTICIPANT_USER,
        });
        return;
    }

    // invalid tokens will not pass the above step
    // so no need to verify

    // register in database
    // get user id
    let tokenData;

    try {
        tokenData = verify(socket.handshake.auth.token, SECRET_KEY);
    } catch (err) {
        ack(false, {
            message: INVALID_TOKEN,
        });
        return;
    }

    // data may be saved later
    (async () => {
        const savedData = await saveDocumentInMessages({
            sender: tokenData.id,
            chatroom,
            text: content,
        });

        // update chatroom
        await updateChatroomById(chatroom, {
            $push: {
                messages: savedData._id,
            },
        });

        ack(true, {
            savedData,
            message: DATA_SUCCESSFULLY_CREATED,
        });
    })();

    socket.to(chatroom).emit(`new_message`, data);
}

/** Updates a message in this chatroom
 * @param {Socket} socket Socket.io socket
 * @param {Object} sessionTokens Object conatining tokens in current session
 * @param {Object} data Object with chatroom and content data
 * @param {Function} ack Acknowledgement function
 */
async function updateMessage(socket, sessionTokens, data, ack) {
    const { chatroom, content, messageId, } = data;

    const token = socket.handshake.auth.token;

    // if user is not sending a token stop
    if (! token || ! sessionTokens[token]) {
        ack(false, {
            message: INVALID_TOKEN,
        });
        return;
    }

    // check that the current user is in this chatroom
    if (! sessionTokens[token][chatroom]) {
        ack(false, {
            message: NON_PARTICIPANT_USER,
        });
        return;
    }

    // invalid tokens will not pass the above step
    // so no need to verify

    // if token is in session tokens then it is assumed
    // that it belongs to a valid user
    // expiration is the only thing that is handled
    let tokenData;

    try {
        tokenData = verify(socket.handshake.auth.token, SECRET_KEY);
    } catch (err) {
        ack(false, {
            message: INVALID_TOKEN,
        });
        return;
    }

    const allowed = await checkMessageUpdateValidity(tokenData, messageId);

    if (allowed) {
        console.log(messageId, content);
        await updateMessagesById(messageId, {
            $set: {
                text: content,
            },
        });

        socket.to(chatroom).emit(`updated_message`, data);

        ack(true, {
            message: DATA_SUCCESSFULLY_UPDATED,
        });
    } else {
        ack(false, {
            message: INVALID_OPERATION,
        });
    }
}

module.exports = {
    subscribeSocket,
    sendMessage,
    updateMessage,
};
