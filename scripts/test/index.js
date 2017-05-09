'use strict';

const Q     = require('q');
const clear = require('./clear');
const add   = require('./add');
const Agent = require('supertest-as-promised');

module.exports = async api => {
    const app   = api.app;
    const agent = new Agent(api.server);

    // Clearing database information
    await clear(app);
    // Adding client
    await add(app, 'client');

    // Adding roles & users
    await add(app, 'role', 'admin', [ '*' ]);
    await add(app, 'user', 'admin');

    return app;
};
