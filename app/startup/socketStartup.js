const { subscribeSocket,
    sendMessage, } = require('../realtime-listeners/chatroomListeners');
const { registerToken, } = require('../realtime-listeners/userListeners');

/** Startup activities of socket io server application\
 * @param {Server} io Socket io server application
 */
function socketStartup(io) {
    // stores tokens for this session
    const sessionTokens = {};

    // for user connection
    io.of(`/user`).on(`connection`, (socket) => {
        socket.emit(`1`);
        socket.on(`register`,
            registerToken.bind(undefined, socket, sessionTokens));
    });

    // for chatrooms
    io.of(`/chatroom`).on(`connection`, (socket) => {
        socket.on(`subscribe`,
            subscribeSocket.bind(undefined, socket, sessionTokens));

        socket.on(`new_message`,
            sendMessage.bind(undefined, socket, sessionTokens));

        // socket.on(`updated_message`, (content, chatroom) => {
        //     socket.to(chatroom).emit(`updated_message`, content);
        // });

        // socket.on(`deleted_message`, (content, chatroom) => {
        //     socket.to(chatroom).emit(`deleted_message`, content);
        // });

        socket.on(`unsubscribe`, (room) => {
            socket.leave(room);
        });
    });
}

module.exports = {
    socketStartup,
};
