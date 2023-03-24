const { Schema, Types: { ObjectId, }, model, } = require('mongoose');
const { messageSchema, } = require('./schemas/messageSchema');

const chatRoomSchema = new Schema({
    participant1: {
        type: ObjectId,
        required: true,
    },
    participant2: {
        type: ObjectId,
        required: true,
    },
    messages: [ messageSchema, ],
});

const ChatroomModel = model(`chatrooms`, chatRoomSchema);

module.exports = {
    ChatroomModel,
};
