const { pbkdf2Sync, } = require(`crypto`);
const { SALT, } = require('../../config');

/** Hashes and returns a hashed version of a string
 * @param {String} password string to hash
 * @return {String} returns a hashed value of password
 */
function hashPassword(password) {
    return pbkdf2Sync(password, SALT, 1000, 64, `sha512`).toString(`hex`);
}

module.exports = {
    hashPassword,
};
