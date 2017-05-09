'use strict';

module.exports = function (app) {
    const DAO = new app.plugins.CrudDao();
    let dao = new DAO(app.models.Client);

    dao.find = async function(id, secret){
        return (await this.model.findId(id)).matchesSecret(secret);
    };

    return dao;
};
