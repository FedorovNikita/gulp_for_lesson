const { src, dest } = require('gulp');
const webp = require('gulp-webp');
const browserSync = require('browser-sync').create();

module.exports= function webpImg() {
  return src('src/img/**/*.{jpg, png}')
    .pipe(webp())
    .pipe(dest('build/img'))
    .pipe(browserSync.stream());
};