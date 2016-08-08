var settings = require('./karma.conf.js').settings;

module.exports = function (karma) {
  karma.set(Object.assign(settings, {
    singleRun: false,
    autoWatch: true,
    autoWatchBatchDelay: 1000,
    reporters: ['spec'],
    browsers: ['Chrome', 'Safari']
  }));
};
