const { StatusCodes } = require('http-status-codes');

class BaseController {
    sendSuccess(res, data) {
        return res.status(StatusCodes.OK).json(data);
    }

    sendCreated(res, data) {
        return res.status(StatusCodes.CREATED).json(data);
    }

    sendUpdated(res, data) {
        return res.status(StatusCodes.OK).json(data);
    }

    sendDeleted(res) {
        return res.sendStatus(StatusCodes.NO_CONTENT);
    }
}

module.exports = BaseController;
