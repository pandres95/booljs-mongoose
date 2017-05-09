'use strict';

const faker = require('faker');

module.exports = () => ({
    name: faker.hacker.noun(),
    description: faker.hacker.phrase()
});
