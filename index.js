'use strict';

const Bool = require('bool.js');

let API = new Bool('com.example.api', [
    'booljs-mongoose', 'mongoose', 'mongoose-private-paths',
    'mongoose-deep-populate',

    'crypto', 'bcryptjs', 'request-promise', 'moment',

    'booljs-passport', 'booljs-oauth2',
    require.resolve('./middleware/permissions-check'),
    require.resolve('./middleware/roles-check'),
    'passport-http', 'passport-http-bearer', 'passport-oauth2-client-password'

]);

module.exports = (API
    .setDatabaseLoader('booljs-mongoose')
).run();
