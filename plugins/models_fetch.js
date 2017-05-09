'use strict';

module.exports = function (app) {
    return _.map(Object.keys(app.models), x => x.toLowerCase());
};
