'use strict';

module.exports = function (app, Schema) {
    const crypto = app.utilities.crypto;

    let clientSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        description: String,
        secret: {
            type: String,
            required: true,
            default: () => crypto.randomBytes(32).toString('base64')
        },
        redirectUri: String
    });

    clientSchema.plugin(new app.plugins.CrudMongoose());

    clientSchema.methods.matchesSecret = function (secret) {
        return this.secret === secret ? this : null;
    };

    return clientSchema;
};
