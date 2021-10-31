/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  rootDir: 'src/integration-tests/tests',
};
