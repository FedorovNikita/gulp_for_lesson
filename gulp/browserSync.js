const browserSync = require('browser-sync').create();

module.exports = function serve() {
  browserSync.init({
    server: 'build'
  });
};