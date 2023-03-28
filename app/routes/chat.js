const { Router, } = require('express');
const { registerRoom,
    sendMessage,
    updateMessage,
    listMessage,
    deleteMessage,
    readChatroom, } = require('../controllers/chatContollers');
const { checkToken, } = require('../helpers/checkToken');
const { validateBody, validateParams, } = require('../middleware/validators');
const { TOKEN_TYPES, } = require('../util/constants');
const { registerRoomSchema,
    messageSchema,
    soleIdSchema, } = require('../validators');

// eslint-disable-next-line new-cap
const chatroomRouter = Router();

chatroomRouter.post(`/`,
    checkToken(TOKEN_TYPES.LOGIN),
    validateBody(registerRoomSchema),
    registerRoom);

chatroomRouter.get(`/messages/:id`,
    checkToken(TOKEN_TYPES.LOGIN),
    validateParams(soleIdSchema),
    listMessage);

chatroomRouter.post(`/messages/:id`,
    checkToken(TOKEN_TYPES.LOGIN),
    validateParams(soleIdSchema),
    validateBody(messageSchema),
    sendMessage);

chatroomRouter.delete(`/messages/:id`,
    checkToken(TOKEN_TYPES.LOGIN),
    validateParams(soleIdSchema),
    deleteMessage);

chatroomRouter.put(`/messages/:id`,
    checkToken(TOKEN_TYPES.LOGIN),
    validateParams(soleIdSchema),
    validateBody(messageSchema),
    updateMessage);

chatroomRouter.get(`/:id`,
    checkToken(TOKEN_TYPES.LOGIN),
    validateParams(soleIdSchema),
    readChatroom);

module.exports = {
    chatroomRouter,
};
