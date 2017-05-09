'use strict';

module.exports = function () {
    return (value, def) => (!_.isUndefined(value) && (
        value === 'undefined' ? undefined : (
            value === 'null' ? null : (value === 'true' && true) ||
            (!_.isNaN(value) && Number(value) || def) ||
            (value === 'false' ? false : (_.isString(value) && value || def))
        )
    ));
};
