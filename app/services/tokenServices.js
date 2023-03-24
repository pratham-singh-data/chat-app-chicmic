const { TokenModel, } = require('../models');
const { saveDocument, findOne, } = require('./operators/serviceOperators');

/** Saves a document in users model
 * @param {Object} doc Document to save
 */
async function saveDocumentInTokens(doc) {
    return await saveDocument(TokenModel, doc);
}

/** Saves a document in users model
 * @param {Object} searchQuery Search query to execute
 * @param {Object} projectionQuery Projection query to execute
 * @return {Object} data retrieved from database
 */
async function findOneInTokens(searchQuery, projectionQuery) {
    return await findOne(TokenModel, searchQuery, projectionQuery);
}

module.exports = {
    saveDocumentInTokens,
    findOneInTokens,
};
