const { error, } = require('./logger');
const { writeFileSync, } = require(`fs`);
const { ERROR_LOGGER_DIRECTORY_URL, } = require('../../config');

/** Logs error to console
 * @param {Error} err Error object
 */
function loggingErrorHandler(err) {
    const errorFileName = `${ERROR_LOGGER_DIRECTORY_URL}/${Date.now()}`;

    writeFileSync(errorFileName, `${err.message}\n\n${err.stack}`);

    error(`${err.message}\n\nFurther details at: ${errorFileName}`);
}

module.exports = {
    loggingErrorHandler,
};
