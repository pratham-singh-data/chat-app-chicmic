require(`dotenv`).config();
const express = require(`express`);
const { expressStartup, } = require('./app/startup/expressStartup');
const { mongoConnect, } = require('./app/startup/mongoStartup');
const { loggingErrorHandler, } = require('./app/util/loggingErrorHandler');

const app = express();

/** Runs all startup tasks for express server */
async function startupActivites() {
    await mongoConnect();
    expressStartup(app);
}

startupActivites().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}`);
    });
});

process.on(`uncaughtException`, loggingErrorHandler);
process.on(`unhandledRejection`, loggingErrorHandler);
