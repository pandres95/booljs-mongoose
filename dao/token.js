'use strict';

module.exports = function (app) {
    const DAO = new app.plugins.CrudDao();
    let dao = new DAO(app.models.Token);

    dao.insert = async function(user, client) {
        return this.model.insert({ user: user, client: client });
    };

    dao.find = function(access, expired) {
        return this.model.findToken(access, expired || false);
    };

    dao.refresh = function(refresh) {
        return this.model.refresh(refresh);
    };

    dao.expire = function(id) {
        return this.model.expire(id);
    };

    return dao;
};
