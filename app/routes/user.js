const { Router, } = require('express');
const { signupUser,
    loginUser,
    listUsers,
    validateUserEmail, } = require('../controllers/userControllers');
const { checkToken, } = require('../helpers/checkToken');
const { validateBody, } = require('../middleware/validateBody');
const { TOKENTYPES, } = require('../util/constants');
const { signupSchema, loginSchema, } = require('../validators');

// eslint-disable-next-line new-cap
const userRouter = Router();

userRouter.post(`/signup`, validateBody(signupSchema), signupUser);
userRouter.post(`/login`, validateBody(loginSchema), loginUser);
userRouter.patch(`/validate`,
    checkToken(TOKENTYPES.TEMP),
    validateBody(loginSchema),
    validateUserEmail);
userRouter.get(`/list`, checkToken(TOKENTYPES.LOGIN), listUsers);

module.exports = {
    userRouter,
};
