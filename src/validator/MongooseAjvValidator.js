const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const addErrors = require('ajv-errors');
const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);
const logger = require('../utils/shared/logger');
const config = require('../config/env');
const buildFluentMiddleware = require('../utils/validator/buildFluentMiddleware');
const ObjectIdPattern = require('../utils/validator/ObjectIdPattern');
const { ValidatorBuilder } = require('./ValidatorBuilder');
const ErrorMapResolver = require('../utils/validator/ErrorMapResolver');

const VALIDATION_SOURCES = Object.freeze(['params', 'query', 'body']);

class MongooseAjvValidator {
    constructor(modelOrSchema, options = {}) {
        const schema = modelOrSchema?.schema || modelOrSchema;

        if (!schema?.paths) {
            logger.error('[Validator] Invalid or missing Mongoose schema.', schema);
            throw new Error('[Validator] Invalid Mongoose schema');
        }

        this.model = modelOrSchema.modelName || null;
        this.jsonSchema = schema.jsonSchema();
        this.requiredFields = Object.entries(schema.paths)
            .filter(([_, def]) => def.options?.required)
            .map(([key]) => key);

        this.ajv = this._createAjvInstance({ stripUnknown: true, ...options });

        if (config.nodeEnv !== 'production') {
            logger.info(`[Validator] JSON Schema loaded with fields: ${Object.keys(schema.paths).join(', ')}`);
        }

        const errorMap = ErrorMapResolver.resolve(this.model);
        if (errorMap) {
            this._injectAjvErrors(this.jsonSchema, errorMap);
        }
    }

    _createAjvInstance(options) {
        const ajv = new Ajv({
            allErrors: true,
            coerceTypes: true,
            removeAdditional: options.stripUnknown !== false,
            useDefaults: true,
            strict: false,
            validateFormats: true,
            ...options
        });
        addFormats(ajv);
        addErrors(ajv);
        return ajv;
    }

    validateSource(source = 'body') {
        if (!VALIDATION_SOURCES.includes(source)) {
            throw new Error(`[Validator] Unsupported validation source: "${source}"`);
        }

        const builder = new ValidatorBuilder(this, source);

        if (source === 'params') {
            this.jsonSchema.properties = this.jsonSchema.properties || {};
            this.jsonSchema.properties.id = ObjectIdPattern;
            this.jsonSchema.properties._id = ObjectIdPattern;
        }

        return buildFluentMiddleware(builder);
    }

    validateBody()   { return this.validateSource('body'); }
    validateParams() { return this.validateSource('params'); }
    validateQuery()  { return this.validateSource('query'); }
    getJsonSchema()  { return this.jsonSchema; }

    _injectAjvErrors(schema, errorMap) {
        const props = schema.properties || {};
        const requiredMap = {};

        for (const [field, def] of Object.entries(props)) {
            const fieldMap = errorMap[field];
            if (!fieldMap) continue;

            def.errorMessage = { ...fieldMap };

            if (fieldMap.required) {
                requiredMap[field] = fieldMap.required;
            }
        }

        if (Object.keys(requiredMap).length > 0) {
            schema.errorMessage = schema.errorMessage || {};
            schema.errorMessage.required = {
                ...schema.errorMessage.required,
                ...requiredMap
            };
        }
    }
}

module.exports = {
    MongooseAjvValidator,
    VALIDATION_SOURCES
};
