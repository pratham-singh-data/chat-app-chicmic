const mongoose = require(`mongoose`);
const { MONGO_URL, } = require('../../config');
/** Asyncronously connects to mongoose server
 */
async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
    console.log(`Successfully connected to MongoDB at ${MONGO_URL}`);
}

module.exports = {
    mongoConnect,
};
