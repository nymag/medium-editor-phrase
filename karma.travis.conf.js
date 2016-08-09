var settings = require('./karma.conf.js').settings;

module.exports = function (karma) {
  karma.set(Object.assign(settings, {
    customLaunchers: {
      // jshint ignore:start
      chromeTravisCi: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
      //jshint ignore:end
    },
    browsers: ['chromeTravisCi']
  }));
};
