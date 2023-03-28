require(`dotenv`).config();
const express = require(`express`);
const { createServer, } = require(`http`);
const { Server, } = require('socket.io');
const { expressStartup, } = require('./app/startup/expressStartup');
const { mongoConnect, } = require('./app/startup/mongoStartup');
const { socketStartup, } = require('./app/startup/socketStartup');
const { loggingErrorHandler, } = require('./app/util/loggingErrorHandler');
const { PORT, } = require('./config');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

/** Runs all startup tasks for express server */
async function startupActivites() {
    await mongoConnect();
    expressStartup(app);
    socketStartup(io);
}

startupActivites().then(() => {
    httpServer.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
});

process.on(`uncaughtException`, loggingErrorHandler);
process.on(`unhandledRejection`, loggingErrorHandler);
