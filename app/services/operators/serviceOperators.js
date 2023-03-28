/** Runs an aggregation pipeline on the given model
 * @param {Model} model Model to run aggregation pipeline on
 * @param {Array} pipeline aggregation pipeline to run
 * @return {Object} Result of operation
 */
async function runAggregate(model, pipeline) {
    return await model.aggregate(pipeline).exec();
}

/** Saves a document in given model
 * @param {Model} model Mongoose model to use
 * @param {Object} doc Document to store in model
 */
async function saveDocument(model, doc) {
    return await model(doc).save();
};

/** Deletes id element from given model
 * @param {Model} model Mongoose compiled model
 * @param {String} id id of element to delete
 */
async function deleteById(model, id) {
    await model.deleteOne({
        _id: id,
    }).exec();
}

/** executes searchQuery on given model
 * @param {Model} model Mongoose compiled model
 * @param {Object} searchQuery search query to execute on collection
 * @param {Object} projectionQuery projection query to execute on collection
 * @return {Object} data from database
 */
async function find(model, searchQuery, projectionQuery) {
    return await model.find(searchQuery, projectionQuery).exec();
}

/** finds id element from given model
 * @param {Model} model Mongoose compiled model
 * @param {String} id id of element to find
 * @return {Object} data from database
 */
async function findById(model, id) {
    return await model.findById(id).exec();
}

/** executes searchQuery on given model
 * @param {Model} model Mongoose compiled model
 * @param {Object} searchQuery search query to execute on collection
 * @param {Object} projectionQuery projection query to execute on collection
 * @return {Object} data from database
 */
async function findOne(model, searchQuery, projectionQuery) {
    return await model.findOne(searchQuery, projectionQuery).exec();
}

/** updates id element from given model
 * @param {Model} model Mongoose compiled model
 * @param {String} id id of element to update
 * @param {Object} updateQuery update query for collection
 */
async function updateById(model, id, updateQuery) {
    await model.updateOne({
        _id: id,
    }, updateQuery).exec();
}

module.exports = {
    runAggregate,
    saveDocument,
    deleteById,
    findById,
    findOne,
    updateById,
    find,
};
