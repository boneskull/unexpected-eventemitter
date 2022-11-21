'use strict';

/**
 * Build script for modern web and Node.js
 */

const esbuild = require('esbuild');
const {
  esbuildPluginVersionInjector,
} = require('esbuild-plugin-version-injector');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

const entryPoints = [path.join(SRC, 'unexpected-eventemitter.js')];
const sourcemap = true;
const plugins = [
  esbuildPluginVersionInjector({
    packageJsonPath: path.join(ROOT, 'package.json'),
  }),
];
const watch = process.argv.slice(2).includes('--watch');

Promise.all([
  esbuild.build({
    entryPoints,
    footer: {
      js:
        '(typeof globalThis === "undefined" ? window : globalThis).unexpectedEventEmitter = unexpectedEventEmitter;',
    },
    format: 'iife',
    globalName: 'unexpectedEventEmitter',
    outfile: path.join(DIST, 'unexpected-eventemitter.js'),
    plugins,
    sourcemap,
    target: 'es6',
    watch,
  }),
  esbuild.build({
    entryPoints,
    format: 'cjs',
    outfile: path.join(DIST, 'unexpected-eventemitter.cjs.js'),
    plugins,
    sourcemap,
    target: 'node14',
    watch,
  }),
]).catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
