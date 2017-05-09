'use strict';

module.exports = function (app) {
    const DAO = new app.plugins.CrudDao();
    return new DAO(app.models.Role);
};
