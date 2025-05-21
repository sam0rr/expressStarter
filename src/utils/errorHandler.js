const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
    logger.error(`[${req.method}] ${req.originalUrl} - ${err.message}`);

    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation error', details: err.errors });
    }

    if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation error', details: err.flatten().fieldErrors });
    }

    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
}

module.exports = errorHandler;
