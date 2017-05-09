'use strict';

module.exports = function (app) {
    const user = new app.controllers.User();

    return [
        {
            method: 'get',
            url: '/users',
            action: user.list,
            cors: true,
            corsExtraHeaders: 'X-Count',
            checkPermissions: true,
            permissions: [ 'user:list', 'user:listMe' ]
        },
        {
            method: 'get',
            url: '/users/:id',
            action: user.find,
            cors: true,
            checkPermissions: true,
            permissions: [ 'user:read', 'user:readMe' ]
        },
        {
            method: 'post',
            url: '/users',
            action: user.insert,
            cors: true,
            authentication: {
                strategy: [ 'httpClientPassword', 'bearer' ]
            }
        },
        {
            method: 'put',
            url: '/users/:id',
            action: user.modify,
            cors: true,
            checkPermissions: true,
            permissions: [ 'user:modify', 'user:modifyMe' ]
        }
    ];

};
