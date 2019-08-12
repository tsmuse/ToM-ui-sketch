const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
  sass.compiler = require('node-sass');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const bs = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');



const settings = {
  styles: {
    glob: './scss/**/*.scss',
    dist: './css/'
  },
  js: {
    glob: './js_src/**/*.js',
    dist: './js/'
  }
};

function buildSass() {
  return src(settings.styles.glob)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('./maps'))
    .pipe(dest(settings.styles.dist));
}

function processJS(){
  return src(settings.js.glob)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('./maps'))
    .pipe(dest(settings.js.dist));
}

function startServer(cb) {
  bs.init({
    server: true,
  });
  cb();
}

function reloadServer(cb) {
  bs.reload();
  cb();
}

function watchSass(){
  watch(settings.styles.glob, series(buildSass, reloadServer));
}

function watchJS(){
  watch(settings.js.glob, series(processJS, reloadServer));
}

function watchPages(){
  watch('./**/*.html', reloadServer);
}

exports.sass = buildSass;
exports.js = processJS;
exports.dev = 
  series(
    parallel(buildSass,processJS), 
    startServer, 
    parallel(watchSass, watchJS, watchPages)
  );
exports.build = parallel(buildSass, processJS);


