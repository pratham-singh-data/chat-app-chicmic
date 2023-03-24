const { MessageModel, } = require('../models');
const { saveDocument, } = require('./operators/serviceOperators');

/** Saves a document in chatrooms model
 * @param {Object} doc Document to save
 * @return {Object} data saved in database
 */
async function saveDocumentInMessages(doc) {
    return await saveDocument(MessageModel, doc);
}

module.exports = {
    saveDocumentInMessages,
};
