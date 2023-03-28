const { findFromChatroomsById, } = require('../services');

/** Confirms if a user can be subscribed to a specified chatroom
 * @param {String} token JWT Token of current user
 * @param {String} room Object ID of room to join
 * @return {Boolean} Whether the current user can join this chatroom
 */
async function confirmChatroomValidity(token, room) {
    // check if the current user is a participant in this
    // chatroom and that the chatroom exists
    const chatroomData = await findFromChatroomsById(room);

    if (! chatroomData) {
        return false;
    }

    if (String(chatroomData.participant1) !== token.id &&
            String(chatroomData.participant2) !== token.id) {
        return false;
    }

    // if here then valid user
    return true;
}

module.exports = {
    confirmChatroomValidity,
};
