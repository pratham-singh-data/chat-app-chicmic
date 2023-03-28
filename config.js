module.exports = {
    PORT: process.env.PORT,
    SALT: process.env.SALT,
    SECRETKEY: process.env.SECRETKEY,
    MONGOURL: process.env.MONGOURL,
    HITLOGFILEURL: `./database/logs/hits.log`,
};
