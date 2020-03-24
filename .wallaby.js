'use strict';

module.exports = () => {
  return {
    files: ['package.json', 'index.js', 'src/**/*.js'],
    tests: ['test/**/*.spec.js'],
    env: {
      type: 'node',
      runner: 'node'
    },
    testFramework: 'mocha'
  };
};
