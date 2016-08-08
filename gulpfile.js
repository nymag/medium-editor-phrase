const babelify = require('babelify'),
  babelPresetEs2015 = require('babel-preset-es2015'),
  browserify = require('browserify'),
  chalk = require('chalk'),
  gulp = require('gulp'),
  gulpRename = require('gulp-rename'),
  gulpUglify = require('gulp-uglify'),
  gulpUtil = require('gulp-util'),
  rollupify = require('rollupify'),
  source = './src/medium-editor-phrase.js',
  vinylBuffer = require('vinyl-buffer'),
  vinylSourceStream = require('vinyl-source-stream');

/**
 *
 * @param {object} err
 */
function logError(err) {
  if (err.fileName) {
    // regular error
    gulpUtil.log(chalk.red(err.name) + ': ' +
      chalk.yellow(err.fileName.replace(__dirname, '')) + ': ' +
      'Line ' + chalk.magenta(err.lineNumber) + ' & ' +
      'Column ' + chalk.magenta(err.columnNumber || err.column) + ': ' +
      chalk.blue(err.description));
  } else {
    // Browserify error
    gulpUtil.log(chalk.red(err.name) + ': ' + chalk.yellow(err.message));
  }
}

gulp.task('scripts', function () {
  const b = browserify({
      entries: [source],
      cache: {},
      packageCache: {}
    });

  b.transform(rollupify);
  b.transform(babelify, { presets: [babelPresetEs2015] });

  return b.bundle()
    .on('error', logError)
    .pipe(vinylSourceStream(source))
    .pipe(vinylBuffer())
    .pipe(gulpRename('medium-editor-phrase.js'))
    .pipe(gulp.dest('dist'))
    .pipe(gulpRename('medium-editor-phrase.min.js'))
    .pipe(gulpUglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['scripts']);
