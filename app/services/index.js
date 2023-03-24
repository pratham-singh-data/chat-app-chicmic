const tokenServices = require(`./tokenServices`);
const userServices = require(`./userServices`);

module.exports = {
    ...tokenServices,
    ...userServices,
};
