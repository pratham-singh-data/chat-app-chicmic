const { MessageModel, } = require('../models');
const { saveDocument, find, } = require('./operators/serviceOperators');

/** Saves a document in messages model
 * @param {Object} doc Document to save
 * @return {Object} data saved in database
 */
async function saveDocumentInMessages(doc) {
    return await saveDocument(MessageModel, doc);
}

/** Find a document in messages model
 * @param {Object} searchQuery Search query to execute
 * @param {Object} projectionQuery Projection query to execute
 * @return {Object} data retrieved from database
 */
async function findInMessages(searchQuery, projectionQuery) {
    return await find(MessageModel, searchQuery, projectionQuery);
}

module.exports = {
    saveDocumentInMessages,
    findInMessages,
};
