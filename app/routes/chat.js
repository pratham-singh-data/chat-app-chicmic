const { Router, } = require('express');
const { registerRoom,
    sendMessage,
    updateMessage,
    listMessage,
    deleteMessage, } = require('../controllers/chatContollers');
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

chatroomRouter.get(`/:id`,
    checkToken(TOKENTYPES.LOGIN),
    validateParams(soleIdSchema),
    listMessage);

chatroomRouter.post(`/messages/:id`,
    checkToken(TOKENTYPES.LOGIN),
    validateParams(soleIdSchema),
    validateBody(messageSchema),
    sendMessage);

chatroomRouter.delete(`/messages/:id`,
    checkToken(TOKENTYPES.LOGIN),
    validateParams(soleIdSchema),
    deleteMessage);

chatroomRouter.put(`/messages/:id`,
    checkToken(TOKENTYPES.LOGIN),
    validateParams(soleIdSchema),
    validateBody(messageSchema),
    updateMessage);

module.exports = {
    chatroomRouter,
};
