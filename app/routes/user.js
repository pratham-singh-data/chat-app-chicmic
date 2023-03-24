const { Router, } = require('express');
const { signupUser, loginUser, } = require('../controllers/userControllers');
const { validateBody, } = require('../middleware/validateBody');
const { signupSchema, loginSchema, } = require('../validators');

// eslint-disable-next-line new-cap
const userRouter = Router();

userRouter.post(`/signup`, validateBody(signupSchema), signupUser);
userRouter.post(`/login`, validateBody(loginSchema), loginUser);

module.exports = {
    userRouter,
};
