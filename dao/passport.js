'use strict';

module.exports = function (app) {
    const Bearer            = app.utilities['passport-http-bearer'];
    const ClientPassword    = app.utilities['passport-oauth2-client-password'];
    const HTTP              = app.utilities['passport-http'];
    const Client            = app.dao.Client;
    const Token             = app.dao.Token;
    const User              = app.dao.User;

    this.bearer = function (passport) {
        passport.serializeUser((user, done) => done(null, user));
        passport.deserializeUser((user, done) => done(null, user));

        return new Bearer.Strategy(async (accessToken, done) => {
            try {
                let token = await new Token().find(accessToken);
                let user  = token && await new User().find(token.user);

                done(null, user && _(user.toObject()).extend({
                    permissions: (_
                        .chain(user.roles)
                        .map(role => role.permissions)
                    ).flatten().unique().value(),
                    roles: _(user.roles).map(role => role._id)
                }) || false);
            } catch(error) { log.error(error); done(error); }
        });
    };

    const clientPasswordAuth = async (id, secret, done) => {
        try {
            let client = (id !== undefined && secret !== undefined) ? (
                await new Client().find(id, secret)
            ) : false;

            done(null, client || false);
        } catch(error) { done(error); }
    };

    this.clientPassword = () => new ClientPassword.Strategy(clientPasswordAuth);
    this.httpClientPassword = () => new HTTP.BasicStrategy(clientPasswordAuth);
    this.basic = () => new HTTP.BasicStrategy(clientPasswordAuth);

};
