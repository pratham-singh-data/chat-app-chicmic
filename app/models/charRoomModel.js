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

const chatRoomModel = model(`chatRoomsSchema`, chatRoomSchema);

module.exports = {
    chatRoomModel,
};
