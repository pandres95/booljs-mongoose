'use strict';

const faker = require('faker');

function generatePoint(origin, radius) {
    var lng = origin[0]
    ,   lat = origin[1];

    let w = radius / 111300 * Math.sqrt(Math.random())
    ,   v = Math.random();

    var x = w * Math.cos(2 * Math.PI * v)
    ,   y = w * Math.sin(2 * Math.PI * v);

    x /= Math.cos(lat);

    return [lng + x, lat + y];
}

module.exports = (coords, maxDistance) => ({
    line1: faker.address.streetAddress(),
    line2: faker.address.secondaryAddress(),
    city: faker.address.city(),
    state: faker.address.stateAbbr(),
    country: faker.address.countryCode(),
    geolocation: {
        type: 'Point',
        coordinates: generatePoint(coords || [0, 0], maxDistance || 1000)
    }
});
