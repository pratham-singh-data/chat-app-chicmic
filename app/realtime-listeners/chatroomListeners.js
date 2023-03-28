const { verify, } = require('jsonwebtoken');
const { isValidObjectId, } = require('mongoose');
const { SECRET_KEY, } = require('../../config');
const { confirmChatroomValidity, } =
    require('../helpers/confirmChatroomValidity');
const { NON_PARTICIPANT_USER,
    NON_EXISTENT_CHATROOM,
    INVALID_TOKEN, } = require('../util/messages');

/** Subscribe the goiven socket to the given room
 * @param {Socket} socket Socket.io socket
 * @param {Object} sessionTokens Object conatining tokens in current session
 * @param {String} room Room to which current user should be subscribed
 */
async function subscribeSocket(socket, sessionTokens, room) {
    // if already joined; don't bother
    if (sessionTokens[socket.handshake.auth.token][room]) {
        socket.emit(`subscribe_success`);
        return;
    }

    // check that room is valid
    if (! isValidObjectId(room)) {
        socket.emit(`subscribe_error`, NON_EXISTENT_CHATROOM);
        return;
    }

    // user is not registered if they
    // are not in the sessionTokens object
    if (! sessionTokens[socket.handshake.auth.token]) {
        socket.emit(`subscribe_error`, INVALID_TOKEN);
        return;
    }

    // if token is in session tokens then it is assumed
    // that it belongs to a valid user
    // expiration is the only thing that is handled
    let token;

    try {
        token = verify(socket.handshake.auth.token, SECRET_KEY);
    } catch (err) {
        socket.emit(`subscribe_error`, INVALID_TOKEN);
        return;
    }

    const allowed = await confirmChatroomValidity(token, room);

    if (allowed) {
        socket.join(room);

        sessionTokens[socket.handshake.auth.token][room] = Date.now();
        console.log(sessionTokens);

        socket.emit(`subscribe_success`);
    } else {
        socket.emit(`subscribe_error`, NON_PARTICIPANT_USER);
    }
}

module.exports = {
    subscribeSocket,
};
