'use strict';

describe('Client', () => {
    const booljs = require('bool.js');
    const test   = require('../scripts/test');

    describe('DAO', () => {
        let dao, user, client, token;

        before(async () => {
            let app = await test((await booljs('com.example.api').run()));

            dao = new app.dao.Token();
            user = _(await new app.dao.User().list()).first();
            client = _(await new app.dao.Client().list()).first();
        });

        it('#insert', async () => expect(
            token = await dao.insert(user._id, client._id)
        ).to.be.ok);

        it('#find', () => expect(
            dao.find(token.access)
        ).to.eventually.have.property('refresh', token.refresh));

        it('#list', () => expect(dao.list()).to.eventually.have.length(1));

        it('#refresh', async () => expect(
            (await dao.refresh(token.refresh)).user.toString()
        ).to.eql(token.user.toString()));

        it('#expire', () => expect(dao.expire(token._id)).to.eventually.be.ok);
    });

});
