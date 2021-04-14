const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();

module.exports = function script() {
  return src('src/script/main.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(dest('build'))
    .pipe(browserSync.stream());
};