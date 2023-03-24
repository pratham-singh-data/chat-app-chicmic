const { generateLocalSendResponse, } = require('../helpers/responder');
const { saveDocumentInChatrooms, } = require('../services');
const { findFromUsersById, } = require('../services/userServices');
const { NONEXISTENTUSER,
    DATASUCCESSFULLYCREATED,
    PARTNERCANNOTBESELF, } = require('../util/messages');

/** Registers a chatroom
 * @param {Request} req Express request object\
 * @param {Response} res Express response object
 * @param {Function} next Express next function
 */
async function registerRoom(req, res, next) {
    const localResponder = generateLocalSendResponse(res);
    const token = req.headers.token;
    const body = req.body;

    try {
        // confirm partner is a user that exists
        if (! await findFromUsersById(body.partner)) {
            localResponder({
                statusCode: 403,
                message: NONEXISTENTUSER,
            });

            return;
        }

        // confirm that parner is not self
        if (body.partner === token.id) {
            localResponder({
                statusCode: 400,
                message: PARTNERCANNOTBESELF,
            });

            return;
        }

        const savedData = await saveDocumentInChatrooms({
            participant1: token.id,
            participant2: body.partner,
        });

        localResponder({
            statusCode: 200,
            message: DATASUCCESSFULLYCREATED,
            savedData,
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    registerRoom,
};
