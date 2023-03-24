const { UserModel, } = require('../models/userModel');
const { saveDocument,
    findById,
    findOne,
    findMany, } = require('./operators/serviceOperators');

/** Saves a document in users model
 * @param {Object} doc Document to save
 * @return {Object} data saved in database
 */
async function saveDocumentInUsers(doc) {
    return await saveDocument(UserModel, doc);
}

/** Finds a document by the given id in users model
 * @param {String} id Id of document to find
 */
async function findFromUsersById(id) {
    return await findById(UserModel, id);
}

/** Finds multiple documents from users model
 * @param {Object} searchQuery Search query to execute
 * @param {Object} projectionQuery Projection query to execute
 * @return {Object} data retrieved from database
 */
async function findManyFromUsers(searchQuery, projectionQuery) {
    return await findMany(UserModel, searchQuery, projectionQuery);
}

/** Find a document in users model
 * @param {Object} searchQuery Search query to execute
 * @param {Object} projectionQuery Projection query to execute
 * @return {Object} data retrieved from database
 */
async function findOneInUsers(searchQuery, projectionQuery) {
    return await findOne(UserModel, searchQuery, projectionQuery);
}

module.exports = {
    saveDocumentInUsers,
    findFromUsersById,
    findManyFromUsers,
    findOneInUsers,
};
