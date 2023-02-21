const redis = require('./src/tests/redisMock');

jest.mock('redis', () => redis);
