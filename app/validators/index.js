const { signupSchema, } = require(`./signupSchema`);
const { loginSchema, } = require(`./loginSchema`);
const { paginationSchema, } = require(`./paginationSchema`);
const { registerRoomSchema, } = require(`./registerRoomSchema`);
const { messageSchema, } = require(`./messageSchema`);
const { soleIdSchema, } = require(`./soleIdSchema`);

module.exports = {
    signupSchema,
    loginSchema,
    paginationSchema,
    registerRoomSchema,
    messageSchema,
    soleIdSchema,
};
