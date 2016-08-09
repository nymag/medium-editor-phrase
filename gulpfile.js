const gulp = require('gulp'),
  gulpBabel = require('gulp-babel'),
  gulpRename = require('gulp-rename'),
  gulpUglify = require('gulp-uglify'),
  pump = require('pump');

gulp.task('default', function (cb) {
  pump([
      gulp.src('./src/medium-editor-phrase.js'),
      gulpBabel({ presets: ['es2015-script'] }),
      gulpRename('medium-editor-phrase.js'),
      gulp.dest('dist'),
      gulpRename('medium-editor-phrase.min.js'),
      gulpUglify(),
      gulp.dest('dist')
    ],
    cb
  );
});
