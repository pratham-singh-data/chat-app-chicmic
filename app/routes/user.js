const { Router, } = require('express');
const { signupUser,
    loginUser,
    listUsers,
    validateUserEmail,
    updateUser, } = require('../controllers/userControllers');
const { checkToken, } = require('../helpers/checkToken');
const { validateBody, validateQuery, } = require('../middleware/validators');
const { TOKEN_TYPES, } = require('../util/constants');
const { signupSchema,
    loginSchema,
    paginationSchema, } = require('../validators');

// eslint-disable-next-line new-cap
const userRouter = Router();

userRouter.post(`/signup`, validateBody(signupSchema), signupUser);
userRouter.post(`/login`, validateBody(loginSchema), loginUser);

userRouter.put(`/update`,
    checkToken(TOKEN_TYPES.LOGIN),
    validateBody(signupSchema),
    updateUser);

userRouter.patch(`/validate`,
    checkToken(TOKEN_TYPES.TEMP),
    validateBody(loginSchema),
    validateUserEmail);

userRouter.get(`/list`,
    checkToken(TOKEN_TYPES.LOGIN),
    validateQuery(paginationSchema),
    listUsers);

module.exports = {
    userRouter,
};
