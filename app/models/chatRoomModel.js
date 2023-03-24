const { Schema, Types: { ObjectId, }, model, } = require('mongoose');

const chatRoomSchema = new Schema({
    participant1: {
        type: ObjectId,
        required: true,
    },
    participant2: {
        type: ObjectId,
        required: true,
    },
    messages: [ ObjectId, ],
});

const ChatroomModel = model(`chatrooms`, chatRoomSchema);

module.exports = {
    ChatroomModel,
};
