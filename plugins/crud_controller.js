'use strict';

module.exports = function (app) {

    return function(DAO) {
        this.Error      = new app.plugins.Error();
        this.DAO        = DAO;
        this.promise    = new app.views.Json().promise;
        this.filter     = new app.plugins.FilterMongoose();

        this.list = (request, response, next) => {
            return this.promise(q.all([
                new this.DAO(), this.filter(request.query)
            ]).spread(
                (dao, filter) => dao.count(filter)
                .then(count => response.header('X-Count', count))
                .then(() => dao.list(filter))
            ), response, next);
        };

        this.find = (request, response, next) => {
            return this.promise(new this.DAO().find((
                request.params.id === 'me' && request.user._id
            ) || request.params.id), response, next);
        };

        this.insert = (request, response, next) => {
            return this.promise(new this.DAO().insert(
                request.body
            ), response, next, 201);
        };

        this.modify = (request, response, next) => {
            return this.promise(new this.DAO().modify((
                request.params.id === 'me' && request.user._id
            ) || request.params.id, request.body), response, next);
        };

        this.delete = (request, response, next) => {
            return this.promise(new this.DAO().delete((
                request.params.id === 'me' && request.user._id
            ) || request.params.id), response, next, 204);
        };
    };

};
