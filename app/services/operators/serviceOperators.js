/** Saves a document in given model
 * @param {Model} model Mongoose model to use
 * @param {Object} doc Document to store in model
 */
async function saveDocument(model, doc) {
    return await model(doc).save();
};

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
async function findMany(model, searchQuery, projectionQuery) {
    return await model.find(searchQuery, projectionQuery).exec();
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

module.exports = {
    saveDocument,
    findById,
    findMany,
    findOne,
};
