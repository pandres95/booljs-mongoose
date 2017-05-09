'use strict';

module.exports = function (app) {
    const errors = _(app.configuration.get('errors')).groupBy('status');
    return function(status, code) {
        return (error => new app.Error(
            status, code, error.message, error.uri || null
        ))(_.findWhere(errors[status] || [], {
            code: code
        }) || {});
    };
};
