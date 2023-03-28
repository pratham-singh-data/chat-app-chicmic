const { appendFileSync, } = require(`fs`);
const { HITLOGFILEURL, } = require('../../config');

/** Logs each hit to the API in local log file (link from config file)
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
function hitLogger(req, res, next) {
    appendFileSync(HITLOGFILEURL,
        `${Date.now()} ${req.method} ${req.originalUrl}\n`);

    next();
}

module.exports = {
    hitLogger,
};
