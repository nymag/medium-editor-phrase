const istanbul = require('browserify-istanbul'),
  babelify = require('babelify');

var settings = {
  autoWatch: false,
  colors: true,
  singleRun: true,
  browserify: {
    transform: [
      'rollupify', // must precede babelify
      babelify.configure({
        presets: ['es2015']
      }),
      istanbul({
        ignore: [
          '**/*.test.js'
        ],
        defaultIgnore: true
      })
    ]
  },
  coverageReporter: {
    type: 'lcovonly',
    dir: 'coverage/',
    includeAllSources: true,
    watermarks: {
      statements: [50, 75],
      functions: [50, 75],
      branches: [50, 75],
      lines: [50, 75]
    }
  },
  reporters: ['dots', 'coverage'],
  files: ['src/*.js'],
  frameworks: ['mocha', 'chai', 'sinon', 'browserify'],
  preprocessors: {
    'src/*.js': ['browserify']
  },
  plugins: [
    'karma-coverage',
    'karma-spec-reporter',
    'karma-browserify',
    'karma-browserstack-launcher',
    'karma-chai',
    'karma-chrome-launcher',
    'karma-firefox-launcher',
    'karma-mocha',
    'karma-safari-launcher',
    'karma-sinon',
  ]
};

module.exports = function (karma) {
  karma.set(Object.assign(settings, {
    browserStack: {
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
      retryLimit: 0
    },
    customLaunchers: {
      // jshint ignore:start
      chromeMac: {
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: '45.0',
        os: 'OS X',
        os_version: 'Yosemite'
      },
      firefoxMac: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '42.0',
        os: 'OS X',
        os_version: 'Yosemite'
      },
      safariMac: {
        base: 'BrowserStack',
        browser: 'safari',
        browser_version: '9',
        os: 'OS X',
        os_version: 'El Capitan'
      },
      edge: {
        base: 'BrowserStack',
        browser: 'edge',
        browser_version: '12.0',
        os: 'Windows',
        os_version: '10'
      },
      mobileSafari: {
        base: 'BrowserStack',
        device: 'iPhone 6',
        os: 'ios',
        os_version: '8.3'
      }
      //jshint ignore:end
    },
    browsers: ['chromeMac', 'firefoxMac', 'safariMac', 'mobileSafari', 'edge']
  }));
};

module.exports.files = settings.files;
module.exports.settings = settings;
