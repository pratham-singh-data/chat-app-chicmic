/** Startup activities of socket io server application\
 * @param {Server} io Socket io server application
 */
function socketStartup(io) {
    io.use((socket, next) => {
        const uid = socket.handshake.auth.uid;
        if (! uid) {
            return next(new Error(`Invalid Username`));
        }
        socket.uid = uid;
        next();
    });

    io.of(/.*/).on(`connection`, (socket) => {
        console.log(`user connected`);

        socket.on(`simple_message`, (content, chatroom) => {
            socket.to(chatroom).emit(`message`, content);
        });
    });
}

module.exports = {
    socketStartup,
};
