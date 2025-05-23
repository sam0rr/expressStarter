function buildFluentMiddleware(builder) {
    const mw = (...args) => builder.middleware().apply(null, args);

    const proto = Object.getPrototypeOf(builder);
    for (const key of Object.getOwnPropertyNames(proto)) {
        if (typeof builder[key] === 'function' && key !== 'constructor' && key !== 'middleware') {
            mw[key] = (...args) => builder[key](...args);
        }
    }

    return mw;
}

module.exports = buildFluentMiddleware;
