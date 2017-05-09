'use strict';

module.exports = function (app) {
    const AppError  = new app.plugins.Error();
    const Token     = app.dao.Token;
    const User      = app.dao.User;

    this.token = function (server, OAuth2) {
        server.exchange(OAuth2.exchange.password(
            async (client, mail, password, scope, done) => {
                try {
                    let token, user = await new User().login(mail, password);

                    if(user !== null || user !== undefined) {
                        token = await new Token().insert(user._id, client._id);
                    } else token = false;

                    (token && done(null, token.access, token.refresh, {
                        scope: (_
                            .chain(user.roles)
                            .map(role => role.permissions)
                        ).flatten().unique().value()
                    })) || done(null, false);
                } catch(error) { log.error(error); done(error); }
            }
        ));

        server.exchange(OAuth2.exchange.refreshToken(
            async (client, refreshToken, scope, done) => {
                try {
                    let token = await new Token().refresh(refreshToken);
                    done(null, token && token.access || false, token.refresh);
                } catch(error) { done(error); }
            }
        ));
    };

};
