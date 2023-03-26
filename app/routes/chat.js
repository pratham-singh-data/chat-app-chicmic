const { Router, } = require('express');
const { registerRoom, sendMessage, } = require('../controllers/chatContollers');
const { checkToken, } = require('../helpers/checkToken');
const { validateBody, validateParams, } = require('../middleware/validators');
const { TOKENTYPES, } = require('../util/constants');
const { registerRoomSchema,
    messageSchema,
    soleIdSchema, } = require('../validators');

// eslint-disable-next-line new-cap
const chatroomRouter = Router();

chatroomRouter.post(`/`,
    checkToken(TOKENTYPES.LOGIN),
    validateBody(registerRoomSchema),
    registerRoom);

chatroomRouter.post(`/sendMessage/:id`,
    checkToken(TOKENTYPES.LOGIN),
    validateBody(messageSchema),
    validateParams(soleIdSchema),
    sendMessage);

chatroomRouter.post(`/messages/:id`,
    checkToken(TOKENTYPES.LOGIN),
    validateParams(soleIdSchema),
    sendMessage);

module.exports = {
    chatroomRouter,
};
