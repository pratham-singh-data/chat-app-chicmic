const { Schema, Types: { ObjectId, }, model, } = require('mongoose');

const messageSchema = new Schema({
    sender: {
        type: ObjectId,
        required: true,
    },
    chatroom: {
        type: ObjectId,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const MessageModel = model(`messages`, messageSchema);

module.exports = {
    MessageModel,
};
