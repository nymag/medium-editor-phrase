const istanbul = require('browserify-istanbul'),
  babelify = require('babelify');

var settings = {
  autoWatch: false,
  colors: true,
  singleRun: true,
  browserify: {
    transform: [
      babelify.configure({
        presets: ['es2015-script']
      }),
      istanbul({
        ignore: [
          '**/*.test.js',
          '**/dist/**'
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
  reporters: ['spec', 'coverage'],
  files: ['src/*.js'],
  frameworks: ['mocha', 'chai', 'browserify'],
  preprocessors: {
    'src/*.js': ['browserify']
  },
  plugins: [
    'karma-coverage',
    'karma-coveralls',
    'karma-spec-reporter',
    'karma-browserify',
    'karma-browserstack-launcher',
    'karma-chai',
    'karma-chrome-launcher',
    'karma-firefox-launcher',
    'karma-mocha',
    'karma-safari-launcher'
  ]
};

module.exports = function (karma) {
  karma.set(Object.assign(settings, {
    browsers: ['Chrome']
  }));
};

module.exports.files = settings.files;
module.exports.settings = settings;
