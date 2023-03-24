const { error, } = require('./logger');

/** Logs error to console
 * @param {Error} err Error object
 */
function loggingErrorHandler(err) {
    error(err.message);
}

module.exports = {
    loggingErrorHandler,
};
