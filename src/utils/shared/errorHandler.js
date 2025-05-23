const logger   = require('./logger');
const AppError = require('../../errors/AppError');

function normalizeError(err) {
    if (err instanceof AppError) {
        return err;
    }

    const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 600
        ? err.status
        : 500;

    return new AppError(
        err.message || 'An error occurred',
        status,
        err.details
    );
}

function buildPayload({ code, message, details, stack }) {
    const payload = {
        timestamp: new Date().toISOString(),
        code,
        message
    };

    if (details) {
        payload.details = details;
    }

    if (process.env.NODE_ENV === 'development' && stack) {
        payload.stack = stack;
    }

    return payload;
}

function errorHandler(err, req, res, next) {
    const error   = normalizeError(err);
    const payload = buildPayload(error);

    logger.error(`${req.method} ${req.originalUrl} → [${error.status}] ${error.message}`);

    res.status(error.status).json(payload);
}

module.exports = errorHandler;
