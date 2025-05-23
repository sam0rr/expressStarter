const Joi = require('joi');
const JoiMapper = require('mongoose-joi-schema');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../errors/AppError');
const logger = require('../utils/logger');

const VALIDATION_SOURCES = Object.freeze(['params', 'query', 'body']);

class MongooseJoiValidator {

    constructor(model, options = {}) {
        JoiMapper(model.schema, Joi);

        this.schema = model.joiSchema;
        this.joiOptions = {
            abortEarly: false,
            stripUnknown: true,
            ...options
        };
    }

    validate(source = 'body') {
        if (!VALIDATION_SOURCES.includes(source)) {
            throw new Error(`[Validator] Unsupported validation source: "${source}"`);
        }
        return this._makeMiddleware(source);
    }

    validateBody()   { return this.validate('body'); }
    validateParams() { return this.validate('params'); }
    validateQuery()  { return this.validate('query'); }

    validateAll(sources = VALIDATION_SOURCES) {
        const middlewares = sources.map((source) => this.validate(source));

        return async (req, res, next) => {
            try {
                for (const mw of middlewares) {
                    await new Promise((resolve, reject) => {
                        mw(req, res, (err) => err ? reject(err) : resolve());
                    });
                }
                next();
            } catch (err) {
                next(err);
            }
        };
    }

    _makeMiddleware(source) {
        return (req, res, next) => {
            const data = req[source];
            const { error, value } = this.schema.validate(data, this.joiOptions);

            if (error) {
                logger.warn(`[Validator] Failed ${source.toUpperCase()} validation`, {
                    source,
                    errors: error.details,
                    path: req.path,
                    method: req.method
                });

                return next(
                    new AppError(
                        `Validation error in ${source}`,
                        StatusCodes.BAD_REQUEST,
                        error.details
                    )
                );
            }

            req[source] = value;
            next();
        };
    }
}

module.exports = {
    MongooseJoiValidator,
    VALIDATION_SOURCES
};
