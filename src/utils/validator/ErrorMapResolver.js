const path = require('path');
const logger = require('../shared/logger');
const config = require('../../config/env');

const LOCALE = config.lang || 'en';
const ERROR_BASE_PATH = path.join(__dirname, '../../errors/locales', LOCALE);

const cache = {};

class ErrorMapResolver {

    static resolve(modelName) {
        if (cache[modelName]) return cache[modelName];

        const fileName = modelName?.toLowerCase() + 'Errors';
        const fullPath = path.join(ERROR_BASE_PATH, fileName);

        try {
            const errorMap = require(fullPath);
            cache[modelName] = errorMap;
            return errorMap;
        } catch {
            logger.debug(`[ErrorMapResolver] No error map for model "${modelName}". Falling back.`);
            return this._tryDefaultFallback();
        }
    }

    static _tryDefaultFallback() {
        if (cache._default) return cache._default;
        try {
            const fallback = require(path.join(ERROR_BASE_PATH, 'defaultErrors'));
            cache._default = fallback._default || fallback;
            return cache._default;
        } catch {
            logger.warn('[ErrorMapResolver] No defaultErrors.js found.');
            return null;
        }
    }
}

module.exports = ErrorMapResolver;

