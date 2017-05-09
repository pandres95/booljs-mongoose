'use strict';

// Configure test environment
process.env.HOST        = process.env.HOSTNAME = '0.0.0.0';
process.env.NODE_ENV    = process.env.TEST_ENV || 'test';

// Boot application
require('..');

// Configure chai environment
const chai              = require('chai');
const promised          = require('chai-as-promised');
global.Agent            = require('supertest-as-promised');

chai.use(promised);
chai.should();
global.expect           = chai.expect;
