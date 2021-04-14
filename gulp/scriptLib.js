const { src, dest } = require('gulp');
const concat = require('gulp-concat');

module.exports = function scriptLib() {
  return src(['node_modules/jquery/dist/jquery.min.js', 'node_modules/slick-carousel/slick/slick.min.js'])
    .pipe(concat('libs.min.js'))
    .pipe(dest('build'))
};