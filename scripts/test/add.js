'use strict';

const _ = require('underscore');

const mock = {
    address: require('../mock/address'),
    client: require('../mock/client'),
    user: require('../mock/user')
};

module.exports = function(app, model) {

    class TestAdd{
        address(origin, radius, extra) {
            return new app.dao.Address().insert(_(
                mock.address(origin, radius)
            ).extend(extra));
        }

        client(extra) {
            return new app.dao.Client().insert(_(mock.client()).extend(extra));
        }

        user(role, extra) {
            return new app.dao.User().insert(_(mock.user(role)).extend(extra));
        }

        role(id, permissions) {
            return new app.dao.Role().insert({
                _id: id, permissions: permissions || []
            });
        }
    }

    let testAdd = new TestAdd();
    let args    = Array.prototype.slice.call(arguments).slice(2);

    return testAdd[model].apply(testAdd, args);
};
