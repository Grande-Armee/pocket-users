/* eslint-disable @typescript-eslint/no-var-requires */
const { join } = require('path');

module.exports = {
  rootDir: 'src/app',
  testRegex: '.spec.ts$',
  coverageDirectory: join(__dirname, 'coverage'),
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  // reporters: ['default', 'jest-junit'],
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  testTimeout: 15000,
};
