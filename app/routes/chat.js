const { Router, } = require('express');
const { registerRoom,
    listMessage,
    readChatroom, } = require('../controllers/chatContollers');
const { checkToken, } = require('../helpers/checkToken');
const { validateBody, validateParams, } = require('../middleware/validators');
const { TOKEN_TYPES, } = require('../util/constants');
const { registerRoomSchema,
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

// chatroomRouter.delete(`/messages/:id`,
//     checkToken(TOKEN_TYPES.LOGIN),
//     validateParams(soleIdSchema),
//     deleteMessage);

// chatroomRouter.put(`/messages/:id`,
//     checkToken(TOKEN_TYPES.LOGIN),
//     validateParams(soleIdSchema),
//     validateBody(messageSchema),
//     updateMessage);

chatroomRouter.get(`/:id`,
    checkToken(TOKEN_TYPES.LOGIN),
    validateParams(soleIdSchema),
    readChatroom);

module.exports = {
    chatroomRouter,
};
