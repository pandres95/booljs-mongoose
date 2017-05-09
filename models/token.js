'use strict';

module.exports = function (app, Schema) {
    const AppError  = new app.plugins.Error();
    const crypto    = app.utilities.crypto;
    const moment    = app.utilities.moment;
    const security  = app.configuration.get('security');

    var tokenSchema = new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
            index: true
        },
        created: {
            type: Date,
            required: true,
            default: Date.now
        },
        expires: {
            type: Date,
            required: true,
            default: () => moment().add(security.token.expiresIn, 'seconds')
        },
        access: {
            type: String,
            required: true,
            default: () => crypto.randomBytes(64).toString('base64')
        },
        refresh: {
            type: String,
            required: true,
            default: () => crypto.randomBytes(64).toString('base64')
        }
    });

    tokenSchema.plugin(new app.plugins.CrudMongoose());

    tokenSchema.statics.findToken = function (access, expired) {
        return this.findOne({
            access: access,
            expires: { [expired && '$lte' || '$gte']: new Date() }
        }).exec();
    };

    tokenSchema.statics.refresh = async function (refresh) {
        let token = await this.findOne({ refresh: refresh }).exec();

        if(token === undefined || token === null) {
            throw new AppError(401, 'invalid_grant');
        } else return this.insert({ user: token.user, client: token.client });
    };

    tokenSchema.statics.expire = function (id) {
        return this.findOneAndUpdate({ _id: id }, {
            expires: new Date()
        }).exec();
    };

    return tokenSchema;
};
