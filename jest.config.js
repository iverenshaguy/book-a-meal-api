const path = require('path');

module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx}',
    '!<rootDir>/src/**/__tests__/**',
  ],
  coverageDirectory: '<rootDir>/coverage/jest',
  coveragePathIgnorePatterns: ['<rootDir>/scripts/', '<rootDir>/tests/'],
  moduleFileExtensions: ['js', 'jsx', 'json'],
  setupFiles: ['<rootDir>/config/tests/config.js'],
  setupFilesAfterEnv: ['<rootDir>/config/tests/setup.js'],
  testMatch: ['<rootDir>/src/**/?(*.)(spec|test).{js,jsx}'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/config/'],
  transform: {
    '^.+\\.(js|jsx|mjs)$': [
      'babel-jest',
      { configFile: path.join(__dirname, 'babel.config.json') },
    ],
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs)$'],
  coverageReporters: [['lcov', { projectRoot: '/' }], 'json', 'text'],
};
