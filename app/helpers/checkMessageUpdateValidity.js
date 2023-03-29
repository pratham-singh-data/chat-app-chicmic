const { isValidObjectId, } = require('mongoose');
const { findFromMessagesById, } = require(`../services/messageServices`);

/** Checks if current user is able to update the given message
 * @param {Object} token Verfied JWT Token
 * @param {String} messageId Id of message to update
 */
async function checkMessageUpdateValidity(token, messageId) {
    // check if messageId is valid
    if (! isValidObjectId(messageId)) {
        return false;
    }

    const messageData = await findFromMessagesById(messageId);

    if (! messageData) {
        return false;
    }

    if (String(messageData.sender) !== token.id) {
        return false;
    }

    // if here then valid
    return true;
}

module.exports = {
    checkMessageUpdateValidity,
};
