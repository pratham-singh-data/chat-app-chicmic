const { Router, } = require('express');
const { registerRoom, } = require('../controllers/chatContollers');
const { checkToken, } = require('../helpers/checkToken');
const { validateBody, } = require('../middleware/validators');
const { TOKENTYPES, } = require('../util/constants');
const { registerRoomValidator, } =
    require('../validators/registerRoomValidator');

// eslint-disable-next-line new-cap
const chatroomRouter = Router();

chatroomRouter.post(`/register`,
    checkToken(TOKENTYPES.LOGIN),
    validateBody(registerRoomValidator),
    registerRoom);

module.exports = {
    chatroomRouter,
};
