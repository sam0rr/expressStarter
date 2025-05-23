const { StatusCodes, getReasonPhrase } = require('http-status-codes');

class AppError extends Error {
    constructor(
        message,
        status = StatusCodes.INTERNAL_SERVER_ERROR,
        details = null
    ) {
        super(message);

        this.name   = this.constructor.name;
        this.status = status;

        const phrase = getReasonPhrase(status) || 'Internal Server Error';
        this.code   = phrase
            .toUpperCase()
            .replace(/ /g, '_');

        if (details != null) {
            this.details = details;
        }

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
