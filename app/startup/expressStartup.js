const { json, } = require('express');
const { notFound, } = require('../controllers/notFoundController');
const { handleError, } = require('../middleware/handleError');
const { hitLogger, } = require('../middleware/hitLogger');
const { userRouter,
    chatroomRouter, } = require('../routes');

/** Startup activities of express application\
 * @param {Application} app Express application object
 */
function expressStartup(app) {
    app.use(json());
    app.use(hitLogger);

    app.use(`/user`, userRouter);
    app.use(`/chat`, chatroomRouter);

    app.use(notFound, handleError);
}

module.exports = {
    expressStartup,
};
