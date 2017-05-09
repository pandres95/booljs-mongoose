'use strict';

module.exports = function (app) {
    const DAO = new app.plugins.CrudDao();
    let dao = new DAO(app.models.User);

    dao.findMail = function(mail) {
        return this.model.findMail(mail);
    };

    dao.login = function(mail, password) {
        return this.model.findMail(mail).then(user => user.login(password));
    };

    return dao;
};
