const mongoose = require(`mongoose`);
const { MONGOURL, } = require('../../config');

/** Asyncronously connects to mongoose server
 */
async function mongoConnect() {
    await mongoose.connect(MONGOURL);
    console.log(`Successfully connected to MongoDB at ${MONGOURL}`);
}

module.exports = {
    mongoConnect,
};
