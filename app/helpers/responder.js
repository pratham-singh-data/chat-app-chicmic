/** Sends a JSON response to the user
 * @param {Response} res Express response object
 * @param {Data} data Data to send in response
 */
function sendResponse(res, data) {
    res.status(data.statusCode ?? 200);
    res.json(data);
}

/** Binds and returns a sendResponse instance with
 * the given response object as the first parameter
 * @param {Response} res Express response object
 * @return {Function} sendResponse bound to give res
 */
function generateLocalSendResponse(res) {
    return sendResponse.bind(undefined, res);
}

module.exports = {
    sendResponse,
    generateLocalSendResponse,
};
