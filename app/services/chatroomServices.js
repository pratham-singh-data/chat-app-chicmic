
const { ChatroomModel, } = require('../models');
const { saveDocument,
    findById,
    findOne,
    updateById,
    runAggregate, } = require('./operators/serviceOperators');

/** Saves a document in chatrooms model
 * @param {Object} doc Document to save
 * @return {Object} data saved in database
 */
async function saveDocumentInChatrooms(doc) {
    return await saveDocument(ChatroomModel, doc);
}

/** Finds a document by the given id chatrooms model
 * @param {String} id Id of document to find
 */
async function findFromChatroomsById(id) {
    return await findById(ChatroomModel, id);
}

/** Find a document in chatrooms model
 * @param {Object} searchQuery Search query to execute
 * @param {Object} projectionQuery Projection query to execute
 * @return {Object} data retrieved from database
 */
async function findOneInChatrooms(searchQuery, projectionQuery) {
    return await findOne(ChatroomModel, searchQuery, projectionQuery);
}

/** Runs an aggregation pipeline on chatrooms model
 * @param {Array} pipeline Aggregation pipeline to execute
 * @return {Object} result of aggregation
 */
async function runAggregateOnChatrooms(pipeline) {
    return await runAggregate(ChatroomModel, pipeline);
}

/** Find a document in chatrooms model
 * @param {String} id id on which to execute update
 * @param {Object} updateQuery update query to execute
 * @return {Object} data retrieved from database
 */
async function updateChatroomById(id, updateQuery) {
    return await updateById(ChatroomModel, id, updateQuery);
}

module.exports = {
    saveDocumentInChatrooms,
    findFromChatroomsById,
    findOneInChatrooms,
    updateChatroomById,
    runAggregateOnChatrooms,
};
