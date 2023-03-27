const { MessageModel, } = require('../models');
const { saveDocument,
    find,
    findById,
    updateById, } = require('./operators/serviceOperators');

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

/** Finds a document by the given id in messages model
 * @param {String} id Id of document to find
 */
async function findFromMessagesById(id) {
    return await findById(MessageModel, id);
}

/** Find a document in users model
 * @param {String} id id on which to execute update
 * @param {Object} updateQuery update query to execute
 * @return {Object} data retrieved from database
 */
async function updateMessagesById(id, updateQuery) {
    return await updateById(MessageModel, id, updateQuery);
}

module.exports = {
    saveDocumentInMessages,
    findInMessages,
    findFromMessagesById,
    updateMessagesById,
};
