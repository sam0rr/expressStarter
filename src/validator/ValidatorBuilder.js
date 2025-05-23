const { StatusCodes } = require('http-status-codes');
const AppError = require('../errors/AppError');
const logger = require('../utils/shared/logger');
const formatAjvErrors = require('../utils/validator/formatAjvErrors');

class ValidatorBuilder {
    constructor(validator, source) {
        this.validator = validator;
        this.source = source;
        this._only = null;
        this._optional = null;
        this._strip = [];
    }

    validateAll() {
        return this.middleware();
    }

    optional(...fields) {
        this._optional = fields;
        return this.middleware();
    }

    optionalAll() {
        const allFields = Object.keys(this.validator.jsonSchema.properties || {});
        return this.optional(...allFields);
    }

    only(...fields) {
        this._only = fields;
        return this.middleware();
    }

    onlyIf(conditionFn, fields) {
        if (conditionFn()) {
            return this.only(...fields);
        }
        return this;
    }

    exclude(...fields) {
        const keys = Object.keys(this.validator.jsonSchema.properties || {});
        const filtered = keys.filter(k => !fields.includes(k));
        return this.only(...filtered);
    }

    omit(...fields) {
        const filtered = this.validator.requiredFields.filter(f => !fields.includes(f));
        return this.only(...filtered);
    }

    strip(...fields) {
        this._strip = fields;
        return this.middleware();
    }

    stripAll() {
        const allFields = Object.keys(this.validator.jsonSchema.properties || {});
        return this.strip(...allFields);
    }

    middleware() {
        const schema = this._buildSchema();
        const validate = this.validator.ajv.compile(schema);

        return (req, res, next) => {
            const data = req[this.source];
            const isValid = validate(data);

            if (!isValid) {
                const formattedErrors = formatAjvErrors(validate.errors, this.source, data);

                logger.warn(`[Validator] ${this.source.toUpperCase()} validation failed`, {
                    method: req.method,
                    path: req.path,
                    source: this.source,
                    errors: formattedErrors,
                    data
                });

                return next(
                    new AppError(`Validation failed for ${this.source}`, StatusCodes.BAD_REQUEST, formattedErrors)
                );
            }

            this._applyStrips(data);
            req[this.source] = data;
            next();
        };
    }

    _buildSchema() {
        const schema = structuredClone(this.validator.jsonSchema);
        const required = this.validator.requiredFields;

        if (this._only?.length) {
            schema.required = this._only;
        } else if (this._optional?.length) {
            schema.required = required.filter(field => !this._optional.includes(field));
        } else {
            schema.required = required;
        }

        return schema;
    }

    _applyStrips(data) {
        if (!this._strip?.length) return;
        for (const field of this._strip) {
            delete data[field];
        }
    }
}

module.exports = { ValidatorBuilder };
