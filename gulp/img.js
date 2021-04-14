const { src, dest } = require('gulp');
const argv = require('yargs').argv;
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

module.exports = function img() {
  return src('src/img/**/*.{jpg, png}')
    .pipe(gulpif(argv.prod, imagemin([
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
    ])))
    .pipe(dest('build/img'))
    .pipe(browserSync.stream());
};