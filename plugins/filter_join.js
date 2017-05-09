'use strict';

module.exports = function () {
    return function() {
        return _.reduce(arguments, (a, b) => _.flatten(
            _.map(a, x => _.map(b, y => x.concat([y]))), true), [ [] ]
        );
    };
};
