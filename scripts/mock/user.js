'use strict';

const faker     = require('faker');
const address   = require('./address');

module.exports = (role, origin, radius) => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    mail: faker.internet.email(),
    password: faker.internet.password(),
    address: address(origin, radius),
    mobile: faker.phone.phoneNumber(),
    roles: [].concat(role || 'admin')
});
