const { verify, } = require('jsonwebtoken');
const { isValidObjectId, } = require('mongoose');
const { SECRET_KEY, } = require('../../config');
const { confirmChatroomValidity, } =
    require('../helpers/confirmChatroomValidity');
const { saveDocumentInMessages, } = require('../services');
const { NON_PARTICIPANT_USER,
    NON_EXISTENT_CHATROOM,
    INVALID_TOKEN,
    DATA_SUCCESSFULLY_CREATED,
    SUCCESSFULLY_SUBSCRIBED, } = require('../util/messages');

/** Subscribe the goiven socket to the given room
 * @param {Socket} socket Socket.io socket
 * @param {Object} sessionTokens Object conatining tokens in current session
 * @param {String} room Room to which current user should be subscribed
 * @param {Function} ack Acknowledgement Function
 */
async function subscribeSocket(socket, sessionTokens, room, ack) {
    console.log(room, ack);
    // if already joined; don't bother
    if (sessionTokens[socket.handshake.auth.token][room]) {
        ack(true, SUCCESSFULLY_SUBSCRIBED);
        return;
    }

    // check that room is valid
    if (! isValidObjectId(room)) {
        ack(false, NON_EXISTENT_CHATROOM);
        return;
    }

    // user is not registered if they
    // are not in the sessionTokens object
    if (! sessionTokens[socket.handshake.auth.token]) {
        ack(false, INVALID_TOKEN);
        return;
    }

    // if token is in session tokens then it is assumed
    // that it belongs to a valid user
    // expiration is the only thing that is handled
    let token;

    try {
        token = verify(socket.handshake.auth.token, SECRET_KEY);
    } catch (err) {
        ack(false, INVALID_TOKEN);
        return;
    }

    const allowed = await confirmChatroomValidity(token, room);

    if (allowed) {
        socket.join(room);

        sessionTokens[socket.handshake.auth.token][room] = Date.now();
        console.log(sessionTokens);

        ack(true, SUCCESSFULLY_SUBSCRIBED);
        socket.emit(`subscribe_success`);
    } else {
        ack(false, NON_PARTICIPANT_USER);
    }
}

/** Sends amessage in this chatroom
 * @param {Socket} socket Socket.io socket
 * @param {Object} sessionTokens Object conatining tokens in current session
 * @param {Object} data Object with chatroom and content data
 * @param {Function} ack Acknowledgement function
 */
async function sendMessage(socket, sessionTokens, data, ack) {
    // console.log(ack, chatroom, content);
    const { chatroom, content, } = data;

    // if user is not sending a token stop
    if (! socket.handshake.auth.token) {
        ack(false, INVALID_TOKEN);
        return;
    }

    const token = socket.handshake.auth.token;

    // check that the current user is in this chatroom
    if (! sessionTokens[token] || ! sessionTokens[token][chatroom]) {
        ack(false, NON_PARTICIPANT_USER);
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
        ack(false, INVALID_TOKEN);
        return;
    }

    (async () => {
        saveDocumentInMessages({
            sender: tokenData.id,
            chatroom,
            text: content,
        });

        ack(true, DATA_SUCCESSFULLY_CREATED);
    })();

    console.log(socket.rooms, chatroom);

    socket.to(chatroom).emit(`new_message`, { chatroom, content, });
}

module.exports = {
    subscribeSocket,
    sendMessage,
};
