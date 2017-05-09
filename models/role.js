'use strict';

module.exports = function (app, Schema) {
    var modelsList      = new app.plugins.ModelsFetch()
    ,   permissionsList = app.configuration.get('permissions')
    ,   join            = new app.plugins.FilterJoin();

    var permissionsEnumeration = _(
        join(
            modelsList,
            _.map(join(permissionsList, ['', 'Me']), x => x.join(''))
        )
    ).map(x => x.join(':'));

    var roleSchema = new Schema({
        _id: {
            type: String,
            required: true,
            unique: true
        },
        permissions: [{
            type: String,
            enum: permissionsEnumeration
        }],
        createdAt: {
            required: true,
            type: Date,
            default: Date.now
        },
        updatedAt: {
            required: true,
            type: Date,
            default: Date.now
        }
    });

    roleSchema.path('permissions').set(function (permissions) {
        var definitivePermissions = [];
        for(let permission of permissions){
            var permissionRegex = new RegExp(
                `${permission.replace('*', '.*')}$`
            );
            definitivePermissions.push(_ /* jshint -W083 */
                (permissionsEnumeration).filter(x => permissionRegex.test(x))
            ); /* jshint +W083 */
        }
        return _.chain(definitivePermissions).flatten().uniq().value();
    });

    roleSchema.pre('save', function (next) {
        if(!this.isNew) { this.updatedAt = Date.now(); }
        next();
    });

    roleSchema.plugin(new app.plugins.CrudMongoose(), { customId: true });
    return roleSchema;
};
