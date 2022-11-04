import karma, { type ConfigOptions } from 'karma';
import karmaMocha from 'karma-mocha';
import karmaChromeLauncher from 'karma-chrome-launcher';
import karmaVite from 'karma-vite';
import puppeteer from 'puppeteer';
import { filterEmptyItems } from './scripts/utils/misc.js';

process.env.CHROME_BIN = puppeteer.executablePath();

const isCI = !!process.env.CI;
const watch = !!process.argv.find((arg) => arg.includes('watch')) && !isCI;
const coverage = !!process.argv.find((arg) => arg.includes('--coverage'));

const options: ConfigOptions = {
  // base path that will be used to resolve all patterns (eg. files, exclude)
  basePath: '',

  plugins: [karmaMocha, karmaChromeLauncher, karmaVite],

  browsers: ['ChromeHeadlessNoSandbox'],
  browserNoActivityTimeout: 60000, //default 10000
  browserDisconnectTimeout: 10000, // default 2000
  browserDisconnectTolerance: 1, // default 0
  captureTimeout: 60000,

  // you can define custom flags
  customLaunchers: {
    ChromeHeadlessNoSandbox: {
      base: 'ChromeHeadless',
      flags: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  },

  // frameworks to use
  // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
  frameworks: ['vite', 'mocha'],

  // list of files / patterns to load in the browser
  files: [
    {
      pattern: 'test/**/*.spec.ts',
      type: 'module',
      watched: false,
      served: false,
    },
    {
      pattern: 'test/**/*.spec.tsx',
      type: 'module',
      watched: false,
      served: false,
    },
  ],

  // list of files / patterns to exclude
  exclude: [],

  // test results reporter to use
  // possible values: 'dots', 'progress'
  // available reporters: https://npmjs.org/browse/keyword/karma-reporter
  reporters: filterEmptyItems(['progress', coverage && 'coverage-istanbul']),

  // web server port
  port: 9876,

  // enable / disable colors in the output (reporters and logs)
  colors: true,

  // enable / disable watching file and executing tests whenever any file changes
  autoWatch: watch,

  // Continuous Integration mode
  // if true, Karma captures browsers, runs the tests and exits
  singleRun: !watch,

  // Concurrency level
  // how many browser should be started simultaneous
  concurrency: Infinity,
};

const cfg = await karma.config.parseConfig(undefined, options, {
  promiseConfig: true,
  throwErrors: true
});

cfg.set({
  // level of logging
  // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
  logLevel: cfg.LOG_INFO,
});

const server = new karma.Server(cfg);
await server.start();
