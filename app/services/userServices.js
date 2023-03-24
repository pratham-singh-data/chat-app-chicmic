const { UserModel, } = require('../models');
const { saveDocument,
    findById,
    findOne,
    updateById,
    runAggregate, } = require('./operators/serviceOperators');

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

/** Find a document in users model
 * @param {Object} searchQuery Search query to execute
 * @param {Object} projectionQuery Projection query to execute
 * @return {Object} data retrieved from database
 */
async function findOneInUsers(searchQuery, projectionQuery) {
    return await findOne(UserModel, searchQuery, projectionQuery);
}

/** Runs an aggregation pipeline on users model
 * @param {Array} pipeline Aggregation pipeline to execute
 * @return {Object} result of aggregation
 */
async function runAggregateOnUsers(pipeline) {
    return await runAggregate(UserModel, pipeline);
}

/** Find a document in users model
 * @param {String} id id on which to execute update
 * @param {Object} updateQuery update query to execute
 * @return {Object} data retrieved from database
 */
async function updateUserById(id, updateQuery) {
    return await updateById(UserModel, id, updateQuery);
}

module.exports = {
    saveDocumentInUsers,
    findFromUsersById,
    findOneInUsers,
    updateUserById,
    runAggregateOnUsers,
};
