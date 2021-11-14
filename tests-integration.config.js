/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('./tests-base.config');

module.exports = {
  ...baseConfig,
  testRegex: '.integration.test.ts$',
};
