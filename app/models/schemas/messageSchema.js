const { Schema, Types: { ObjectId, }, } = require('mongoose');

const messageSchema = new Schema({
    sender: {
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

module.exports = {
    messageSchema,
};
