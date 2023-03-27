/** Startup activities of socket io server application\
 * @param {Server} io Socket io server application
 */
function socketStartup(io) {
    io.of(/.*/).on(`connection`, (socket) => {
        socket.on(`simple_message`, (content, chatroom) => {
            socket.to(chatroom).emit(`message`, content);
        });

        socket.on(`updated_message`, (content, chatroom) => {
            socket.to(chatroom).emit(`message`, content);
        });
    });
}

module.exports = {
    socketStartup,
};
