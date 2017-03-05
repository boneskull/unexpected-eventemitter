'use strict';

module.exports = function wallabyConfig (wallaby) {
  return {
    files: [
      'package.json',
      'src/**/*.js'
    ],
    tests: [
      'test/**/*.spec.js'
    ],
    env: {
      type: 'node',
      runner: 'node'
    },
    testFramework: 'mocha',
    compilers: {
      '**/*.js': wallaby.compilers.babel()
    }
  };
};
