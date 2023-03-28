const { error, } = require('./logger');
const { writeFileSync, } = require(`fs`);
const { ERRORLOGGERDIRECTORYURL, } = require('../../config');

/** Logs error to console
 * @param {Error} err Error object
 */
function loggingErrorHandler(err) {
    const errorFileName = `${ERRORLOGGERDIRECTORYURL}/${Date.now()}`;

    writeFileSync(errorFileName, `${err.message}\n\n${err.stack}`);

    error(`${err.message}\n\nFurther details at: ${errorFileName}`);
}

module.exports = {
    loggingErrorHandler,
};
