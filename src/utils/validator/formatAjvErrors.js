function formatAjvErrors(errors, source = 'body', data = {}) {
    return errors.map(err => {
        const field = err.instancePath.replace(/^\//, '') || err.params?.missingProperty || 'root';

        const message =
            err.keyword === 'type' && field === 'root' && err.message === 'must be object'
                ? `Request ${source} must be a valid JSON object`
                : err.message;

        return {
            field,
            message,
            code: err.keyword,
            path: err.schemaPath,
            value: getValueFromPath(data, field)
        };
    });
}

function getValueFromPath(data, path) {
    if (!path || path === 'root') return data;
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), data);
}

module.exports = formatAjvErrors;
