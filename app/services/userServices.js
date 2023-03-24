const { userModel, } = require('../models/userModel');
const { saveDocument, findOne, } = require('./operators/serviceOperators');

/** Saves a document in users model
 * @param {Object} doc Document to save
 * @return {Object} data saved in database
 */
async function saveDocumentInUsers(doc) {
    return await saveDocument(userModel, doc);
}

/** Saves a document in users model
 * @param {Object} searchQuery Search query to execute
 * @param {Object} projectionQuery Projection query to execute
 * @return {Object} data retrieved from database
 */
async function findOneInUsers(searchQuery, projectionQuery) {
    return await findOne(userModel, searchQuery, projectionQuery);
}

module.exports = {
    saveDocumentInUsers,
    findOneInUsers,
};
