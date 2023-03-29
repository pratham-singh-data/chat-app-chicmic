const { signupSchema, } = require(`./signupSchema`);
const { loginSchema, } = require(`./loginSchema`);
const { paginationSchema, } = require(`./paginationSchema`);
const { registerRoomSchema, } = require(`./registerRoomSchema`);
const { messageSchema, } = require(`./messageSchema`);
const { soleIdSchema, } = require(`./soleIdSchema`);
const { deleteMessageSchema, } = require(`./deleteMessageSchema`);
const { updateMessageSchema, } = require(`./updateMessageSchema`);
const { sendMessageSchema, } = require(`./sendMessageSchema`);

module.exports = {
    signupSchema,
    loginSchema,
    paginationSchema,
    registerRoomSchema,
    messageSchema,
    soleIdSchema,
    deleteMessageSchema,
    updateMessageSchema,
    sendMessageSchema,
};
