'use strict';

module.exports = () => {
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
