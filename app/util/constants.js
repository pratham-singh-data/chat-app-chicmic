module.exports = {
    OBJECTIDREGEX: /^[0-9a-fA-F]{24}$/,
    STRINGLENGTHMIN: 0,
    STRINGLENGTHMAX: {
        NORMAL: 1000,
    },
    TOKENTYPES: {
        TEMP: 0,
        LOGIN: 1,
    },
    TOKENEXPIRYTIME: {
        TEMP: 1800, // 30 * 60; 30 minutes
        LOGIN: 31536000, // 365 * 24 * 60 * 60; 1 year
    },
};
