const { subscribeSocket, } = require('../realtime-listeners/chatroomListeners');
const { registerToken, } = require('../realtime-listeners/internalListeners');

/** Startup activities of socket io server application\
 * @param {Server} io Socket io server application
 */
function socketStartup(io) {
    // stores tokens for this session
    const sessionTokens = {};

    // for internal use
    io.on(`connection`, (socket) => {
        socket.on(`register`,
            registerToken.bind(undefined, socket, sessionTokens));
    });

    // for clients
    io.of(`/chatroom`).on(`connection`, (socket) => {
        socket.on(`subscribe`,
            subscribeSocket.bind(undefined, socket, sessionTokens));

        socket.on(`simple_message`, async (content, chatroom) => {
            socket.to(chatroom).emit(`simple_message`, content);
        });

        socket.on(`updated_message`, (content, chatroom) => {
            socket.to(chatroom).emit(`updated_message`, content);
        });

        socket.on(`deleted_message`, (content, chatroom) => {
            socket.to(chatroom).emit(`deleted_message`, content);
        });

        socket.on(`unsubscribe`, (room) => {
            socket.leave(room);
        });
    });
}

module.exports = {
    socketStartup,
};
