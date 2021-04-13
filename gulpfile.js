const { src, dest, task, watch, series, parallel, } = require('gulp');
const htmlmin = require('gulp-htmlmin');
const gulpHtmlBemValidator = require('gulp-html-bem-validator');
const argv = require('yargs').argv;
const gulpif = require('gulp-if');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const del = require('del');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const svgSprite = require('gulp-svg-sprite');


task('html', () => {
  return src('src/**.html')
    .pipe(gulpHtmlBemValidator())
    .pipe(gulpif(argv.prod, htmlmin({ collapseWhitespace: true })))
    .pipe(dest('build'))
    .pipe(browserSync.stream());
})

task('scss', () => {
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
});

task('watch', () => {
  watch('src/**.html', series('html')).on('change', browserSync.reload);
  watch('src/style/**/*.scss', series('scss')).on('change', browserSync.reload);
  watch('src/script/**/*.js', series('script')).on('change', browserSync.reload);
  watch('src/fonts/*.*', series('fonts')).on('change', browserSync.reload);
  watch('src/img/**/*.{jpg, png}', series('img')).on('change', browserSync.reload);
  watch('src/img/**/*.{jpg, png}', series('webp')).on('change', browserSync.reload);
  watch('src/img/svg/*.svg', series('svg')).on('change', browserSync.reload);
});

task('clean', () => {
  return del('build')
});

task('browser-sync', () => {
  browserSync.init({
    server: 'build'
  });
});

task('img', () => {
  return src('src/img/**/*.{jpg, png}')
    .pipe(gulpif(argv.prod, imagemin([
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
    ])))
    .pipe(dest('build/img'))
    .pipe(browserSync.stream());
})

task('webp', () => {
  return src('src/img/**/*.{jpg, png}')
    .pipe(webp())
    .pipe(dest('build/img'))
    .pipe(browserSync.stream());
})

task('fonts', () => {
  return src('src/fonts/*.*')
    .pipe(dest('build/fonts'))
    .pipe(browserSync.stream());
})

task('script', () => {
  return src('src/script/main.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(dest('build'))
    .pipe(browserSync.stream());
})

task('script-lib', () => {
  return src(['node_modules/jquery/dist/jquery.min.js', 'node_modules/slick-carousel/slick/slick.min.js'])
    .pipe(concat('libs.min.js'))
    .pipe(dest('build'))
})

task('svg', () => {
  return src('src/img/svg/*.svg')
      .pipe(svgmin({
          js2svg: {
              pretty: true
          }
      }))
      .pipe(cheerio({
          run: function($) {
              $('[fill]').removeAttr('fill');
              $('[stroke]').removeAttr('stroke');
              $('[style]').removeAttr('style');
          },
          parserOptions: { xmlMode: true }
      }))
      .pipe(replace('&gt;', '>'))
      .pipe(svgSprite({
          mode: {
              symbol: {
                  sprite: 'sprite.svg'
              }
          }
      }))
      .pipe(dest('build/img/svg'))
      .pipe(browserSync.stream());
});


task('default', series('clean', parallel('html', 'scss', 'script', 'script-lib', 'img', 'webp', 'svg', 'fonts'), parallel('watch', 'browser-sync')));
task('build', series('clean', parallel('html', 'scss', 'script', 'script-lib', 'img', 'webp', 'svg', 'fonts')));

