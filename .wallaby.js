'use strict';

module.exports = function wallabyConfig(wallaby) {
  return {
    files: ['package.json', 'index.js'],
    tests: ['test/**/*.spec.js'],
    env: {
      type: 'node',
      runner: 'node'
    },
    testFramework: 'mocha'
  };
};
