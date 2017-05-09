'use strict';

module.exports = function (app) {
    const parse = new app.plugins.FilterFallback();

    const queryParser = object => ((_
        .chain(object)
        .mapObject(val => _.isArray(val) ? (
            arrayParser(val)
        ) : _.isObject(val) && queryParser(val) || parse(val))
    ).value());

    const arrayParser = object => ((_
        .chain(object)
        .map(val => _.isArray(val) ? (
            arrayParser(val)
        ) : _.isObject(val) && queryParser(val) || parse(val))
    ).value());

    return filter => ({
        query: queryParser((_
            .chain(filter)
            .omit([
                'fields', 'limit', 'skip', 'sort',
                'lng', 'lat', 'll', 'location', 'near'
            ])
        ).value()),
        near: (
            (!_
                .chain(Object.keys(filter))
                .intersection([ 'll', 'location', 'near', 'lng', 'lat' ])
                .isEmpty().value()
            ) && (!_
                .chain(Object.keys(filter))
                .intersection([ 'll', 'location', 'near' ])
                .isEmpty().value() && (_
                    .chain((
                        filter.ll || filter.location || filter.near
                    ).split(','))
                    .map(data => Number(data) || 0)
                ).value() || [ filter.lng, filter.lat ]
            ) || undefined
        ),
        fields: filter.fields || {},
        options: _({
            limit: parse(filter.limit, 10),
            skip:  parse(filter.skip, undefined),
            sort:  filter.sort
        }).pick(value => !_.isUndefined(value))
    });
};
