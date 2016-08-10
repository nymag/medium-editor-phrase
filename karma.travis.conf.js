var settings = require('./karma.conf.js').settings;

module.exports = function (karma) {
  karma.set(Object.assign(settings, {
    // jshint ignore:start
    customLaunchers: {
      chromeTravisCi: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    reporters: ['dots', 'coverage', 'coveralls'], // karma-coveralls sends report to coveralls
    coverallsReporter: {
      repo_token: 'UfVJaN75QPI0kCZhdLrECQe1rX82nuA9v'
    },
    browsers: ['chromeTravisCi']
    //jshint ignore:end
  }));
};
