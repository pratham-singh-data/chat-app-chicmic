const { isValidObjectId, } = require('mongoose');

/** Checks if input is a valid objectID
 * @param {String} inp Input to validate
 * @return {String} A validated inp
 */
function objectIdValidator(inp) {
    if (! isValidObjectId(inp)) {
        throw new Error(`Cannot cast to ObjectId`);
    }

    return inp;
}

module.exports = {
    objectIdValidator,
};
