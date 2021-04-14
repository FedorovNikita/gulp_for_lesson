const { src, dest } = require('gulp');
const browserSync = require('browser-sync').create();

module.exports = function fonts() {
  return src('src/fonts/*.*')
    .pipe(dest('build/fonts'))
    .pipe(browserSync.stream());
};