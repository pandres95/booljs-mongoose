'use strict';

const API = require('booljs-api');

module.exports = class RolesChecker extends API.RouteMiddleware {

    constructor(){
        super('roles-checker', 'mandatory', { checkRoles: true });
    }

    action(_instance, router, route) {
        let app = _instance.getComponents();

        return function (request, response, next) {
            if(_(route.roles).intersection(request.user.roles).length > 0) {
                return next();
            }
            return next(new app.Error(403, 'E_INVALID_ROLE', {
                'en': 'The actual user\'s role is invalid',
                'es': 'El rol del usuario actual es invalido'
            }));
        };
    }
};
