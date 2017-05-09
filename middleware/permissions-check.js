'use strict';

const API = require('booljs-api');

module.exports = class PermissionsChecker extends API.RouteMiddleware {

    constructor() {
        super('permissions-checker', 'mandatory', { checkPermissions: true });
        this.priority = 10;
    }

    action(_instance, router, route) {
        let app = _instance.getComponents();

        return function (request, response, next) {
            log.debug(request.user);
            if(_.intersection(
                route.permissions, request.user.permissions
            ).length > 0) { return next(); }

            return next(new app.Error(403, 'E_MISSINGPERMISSIONS', {
                'en': 'You have insuficient permissions to execute this action',
                'es': 'Tiene insuficientes permisos para ejectutar esta acción'
            }));
        };
    }
};
