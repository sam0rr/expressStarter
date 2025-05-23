function bindAllMethods(instance) {
    const proto = Object.getPrototypeOf(instance);

    for (const key of Object.getOwnPropertyNames(proto)) {
        const value = instance[key];

        if (key !== 'constructor' && typeof value === 'function') {
            instance[key] = value.bind(instance);
        }
    }

    return instance;
}

module.exports = bindAllMethods;
