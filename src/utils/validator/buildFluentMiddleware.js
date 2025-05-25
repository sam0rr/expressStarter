function buildFluentMiddleware(builder) {
    let cached;

    const mw = (req, res, next) => {
        if (!cached) {
            cached = builder.middleware();
        }
        return cached(req, res, next);
    };

    const proto = Object.getPrototypeOf(builder);
    for (const key of Object.getOwnPropertyNames(proto)) {
        if (
            typeof builder[key] === 'function' &&
            key !== 'constructor' &&
            key !== 'middleware'
        ) {
            mw[key] = (...args) => {
                builder[key](...args);
                return mw;
            };
        }
    }

    return mw;
}


module.exports = buildFluentMiddleware;
