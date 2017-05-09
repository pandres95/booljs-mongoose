'use strict';

describe('Client', () => {
    const booljs = require('bool.js');
    const clear  = require('../scripts/test/clear');
    const mock   = require('../scripts/mock/client');

    describe('DAO', () => {
        let dao, id, secret;

        before(async () => {
            let app = await clear((await booljs('com.example.api').run()).app);
            dao = new app.dao.Client();
        });

        let _client;
        it('#insert', () => dao.insert((_client = mock())).then(client => {
            id = client._id;
            secret = client.secret;
            expect(client.name).to.eql(_client.name);
        }));

        it('#find', () => expect(
            dao.find(id, secret)
        ).to.eventually.have.property('secret', secret));

        it('#list', () => expect(dao.list()).to.eventually.have.length(1));

        it('#modify', () => expect(
            dao.modify(id, (_client = mock()))
        ).to.eventually.have.property('name', _client.name));

        it('#delete', () => dao.delete(id));
    });

});
