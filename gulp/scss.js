const { src, dest } = require('gulp');
const argv = require('yargs').argv;
const gulpif = require('gulp-if');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();

module.exports = function scss() {
  return src('src/style/main.scss')
    .pipe(gulpif(!argv.prod, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 3 version']
    }))
    .pipe(gulpif(argv.prod, csso()))
    .pipe(gulpif(!argv.prod, sourcemaps.write()))
    .pipe(gulpif(argv.prod, rename({suffix: '.min'})))
    .pipe(dest('build/style'))
    .pipe(browserSync.stream());
};