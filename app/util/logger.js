const colors = require(`colors/safe`);

/** Logs error into console
 * @param {String} message message to print to console
 */
function error(message) {
    console.error(colors.red(message));
}

module.exports = {
    error,
};
