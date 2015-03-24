// CapCrunch Build
// ==================================================
'use strict';

var gulp        = require('gulp'),
    del         = require('del'),
    browserify  = require('browserify'),
    watchify    = require('watchify'),
    babelify    = require('babelify'),
    sequence    = require('run-sequence'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    $           = require('gulp-load-plugins')(),
    state       = process.env.NODE_ENV || 'development',
    env         = {
      prod      : (state === 'production'),
      dev       : (state === 'development' || state === 'test')
    };


// Tasks
// --------------------------------------------------

gulp.task('default', function() {
  $.util.log($.util.colors.green('Run "gulp watch", "gulp dev" or "gulp ship"'));
});

gulp.task('dev', ['clean'], function() {
  gulp.start(['jade', 'sass', 'watch', 'watchify']);
});

gulp.task('ship', ['clean'], function(cb) {
  env = { prod: true, dev: false };
  sequence(['jade', 'sass', 'browserify'], cb);
});

gulp.task('watch', function() {
  $.livereload.listen({ quiet: true });
  gulp.watch('app/templates/**/*.jade', ['jade']);
  gulp.watch('app/sass/**/*.scss', ['sass']);
});

gulp.task('clean', function(cb) {
  del(['public/js/*.js*', 'public/css/*.css*'], cb);
});


// Helpers
// --------------------------------------------------

function logError(err) {
  if (env.dev) { $.util.beep(); }
  $.util.log($.util.colors.red(err.message));
}


// JavaScript
// --------------------------------------------------

gulp.task('watchify', function() {
  var bundler = watchify(browserify('./app/js/app.jsx', watchify.args));

  function rebundle() {
    return bundler
      .bundle()
      .on('error', logError)
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('public/js'))
      .pipe($.size({ title: 'watchify' }))
      .pipe($.livereload());
  }

  bundler.transform(babelify)
  .on('update', rebundle);
  return rebundle();
});

gulp.task('browserify', function() {
  return browserify('./app/js/app.jsx')
    .transform(babelify)
    .bundle()
    .on('error', logError)
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.uglify())
    .pipe(gulp.dest('public/js'))
    .pipe($.if(env.dev, $.size({ title: 'browserify' })));
});


// Sass
// --------------------------------------------------

gulp.task('sass', function() {
  return gulp.src('app/sass/base.scss')
    .pipe($.if(env.dev, $.sourcemaps.init()))
    .pipe($.sass({ errLogToConsole: true }))
    .pipe($.autoprefixer('last 2 versions'))
    .pipe($.rename('core.css'))
    .pipe($.if(env.dev, $.sourcemaps.write('.')))
    .pipe($.if(env.prod, $.csso()))
    .pipe(gulp.dest('public/css'))
    .pipe($.if(env.dev, $.size({ title: 'sass' })))
    .pipe($.if(env.dev, $.livereload()));
});


// Jade
// --------------------------------------------------

gulp.task('jade', function() {
  return gulp.src('app/templates/*.jade')
    .pipe($.jade())
    //.on('error', logError)
    .pipe(gulp.dest('public'))
    .pipe($.if(env.dev, $.size({ title: 'jade' })))
    .pipe($.if(env.dev, $.livereload()));
});
