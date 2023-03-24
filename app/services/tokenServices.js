const { TokenModel, } = require('../models/tokenModel');
const { saveDocument, } = require('./operators/serviceOperators');

/** Saves a document in users model
 * @param {Object} doc Document to save
 */
async function saveDocumentInTokens(doc) {
    return await saveDocument(TokenModel, doc);
}

module.exports = {
    saveDocumentInTokens,
};
