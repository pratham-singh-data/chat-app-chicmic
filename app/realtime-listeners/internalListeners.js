const { TOKEN_NOT_REGISTERED, } = require('../util/messages');

/** Registers a token in sessionTokens
 * @param {Socket} socket Socket.io socket
 * @param {Object} sessionTokens Object conatining tokens in current session
 * @param {String} token JWT token to register
 */
function registerToken(socket, sessionTokens, token) {
    if (sessionTokens[token]) {
        socket.emit(`register_error`, TOKEN_NOT_REGISTERED);
        return;
    }

    sessionTokens[token] = {};
    console.log(sessionTokens);

    socket.emit(`register_success`);
}

module.exports = {
    registerToken,
};
