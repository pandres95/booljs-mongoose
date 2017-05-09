'use strict';

module.exports = function (app) {
    const Controller = new app.plugins.CrudController();
    return new Controller(app.dao.User);
};
