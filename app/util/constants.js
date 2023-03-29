module.exports = {
    STRING_LENGTH_MIN: 0,
    STRING_LENGTH_MAX: {
        NORMAL: 1000,
    },
    TOKEN_TYPES: {
        TEMP: 0,
        LOGIN: 1,
    },
    TOKEN_EXPIRY_TIME: {
        TEMP: 1800, // 30 * 60; 30 minutes
        LOGIN: 31536000, // 365 * 24 * 60 * 60; 1 year
    },
};
