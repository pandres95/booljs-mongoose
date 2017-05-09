'use strict';

const _         = require('underscore');
const sequence  = functions => functions.reduce(
    (p, t) => p.then(t), Promise.resolve()
);

module.exports = async (app, exclude) => {
    const models = (_
        .chain(app.models).keys()
        .map(key => [
            key.charAt(0).toLowerCase() + key.slice(1), new app.models[key]()
        ]).object()
        .pick((value, key) => !_(exclude || []).contains(key)).values()
    ).value();

    return sequence((_
        .chain(models)
        .map(model => new Promise(s => model.collection.remove(s)))
    ).value()).then(() => app);
};
