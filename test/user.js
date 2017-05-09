'use strict';

describe('User', () => {
        const booljs    = require('bool.js');
        const test      = require('../scripts/test');
        const mock      = require('../scripts/mock/user');

    describe('DAO', () => {
        let dao, id, user;

        before(() => booljs('com.example.api').run().then(test).then(app => {
            dao = new app.dao.User();
        }));

        it('#insert', () => expect(
            dao.insert((user = mock('admin')))
        ).to.eventually.have.property('firstName', user.firstName));

        it('#list', () => expect(dao.list()).to.eventually.have.length(2));

        it('#findMail', () => dao.findMail(user.mail).then(_user => {
            id = _user.id;
            return _user.login(user.password);
        }));

        it('#modify', () => {
            user.mail = 'new@agentowl.me';
            user.password = 'agentowl';
            user.address.line2 = '';
            return expect(dao.modify(id, {
                mail: user.mail,
                password: user.password,
                address: {
                    line2: user.address.line2
                }
            })).to.eventually.have.property('mail', user.mail);
        });

        it('#login', () => dao.findMail(user.mail).then(_user => {
            id = _user.id;
            return _user.login(user.password);
        }));

        it('#delete', () => dao.delete(id));

    });

    describe('Controller', () => {
        let agent, client, token, user = mock('admin');

        before(async () => {
            let api = await booljs('com.example.api').run();
            let app = await test(api);
            agent   = new Agent(api.server);
            client  = _(await new app.dao.Client().list()).first();
        });

        it('POST /users', () => {
            return (agent
                .post('/users')
                .auth(client._id.toString(), client.secret)
                .send(user)
            ).expect(201);
        });

        it('POST /auth/token', () => {
            return (agent
                .post('/auth/token')
                .type('form')
                .send({
                    grant_type: 'password',
                    client_id: client._id.toString(),
                    client_secret: client.secret,
                    username: user.mail,
                    password: user.password
                })
                .expect(200)
            ).then(res => (token = `Bearer ${res.body.access_token}`));
        });

        it('PUT /users/me', () => {
            return expect((agent
                .put('/users/me')
                .set('Authorization', token)
                .send({ lastName: "" })
                .expect(500)
            ).then(res => log.error(res.body)));/*
            return expect((agent
                .put('/users/me')
                .set('Authorization', token)
                .send({ lastName: "" })
                .expect(200)
            ).then(res => res.body.data)).to.eventually.have.property(
                'lastName', ''
            );*/
        });

        it('GET /users', () => expect((agent
            .get('/users')
            .set('Authorization', token)
            .expect(200)
        ).then((res) => res.body.data)).to.eventually.have.length(2));

    });

});
