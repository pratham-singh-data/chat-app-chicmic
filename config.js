module.exports = {
    PORT: process.env.PORT ?? 8000,
    SALT: process.env.SALT ?? `DEFAULT_SALT`,
    SECRET_KEY: process.env.SECRET_KEY ?? `DEFAULT_KEY`,
    // this must not work without a connected database
    MONGO_URL: process.env.MONGO_URL,
    HIT_LOG_FILE_URL: `./database/logs/hits.log`,
    ERROR_LOGGER_DIRECTORY_URL: `./database/logs/errors`,
    SOCKET_URL: {
        INTERNAL: `http://localhost:${process.env.PORT ?? 8000}`,
        CLIENT: {
            CHATROOM: `http://localhost:${process.env.PORT ?? 8000}/chatroom`,
        },
    },
};
