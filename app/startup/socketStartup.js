/** Startup activities of socket io server application\
 * @param {Server} io Socket io server application
 */
function socketStartup(io) {
    io.on(`connection`, (socket) => {
        socket.on(`subscribe`, (room) => {
            socket.join(room);
        });

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
