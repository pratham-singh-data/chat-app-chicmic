const { json, } = require('express');
const { handleError, } = require('../middleware/handleError');
const { userRouter,
    chatroomRouter, } = require('../routes');

/** Startup activities of express application\
 * @param {Application} app Express application object
 */
function expressStartup(app) {
    app.use(json());

    app.use(`/user`, userRouter);
    app.use(`/chat`, chatroomRouter);

    app.use(handleError);
}

module.exports = {
    expressStartup,
};
