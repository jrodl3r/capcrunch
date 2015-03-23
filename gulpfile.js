// CapCrunch Build
// ==================================================
'use strict';

var gulp        = require('gulp'),
    glob        = require('glob'),
    del         = require('del'),
    chalk       = require('chalk'),
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
  $.util.log(chalk.green('Run "gulp watch", "gulp dev" or "gulp ship"'));
});

gulp.task('dev', ['clean'], function() {
  gulp.start(['jade', 'sass', 'watch', 'watchify']);
});

gulp.task('ship', ['clean'], function(cb) {
  env = { prod: true, dev: false };
  sequence(['jade', 'sass', 'browserify'], cb);
});

gulp.task('heroku', ['clean'], function(cb) {
  sequence(['jade-post', 'sass-post', 'browserify-post'], cb);
});

gulp.task('watch', function() {
  $.livereload.listen({ quiet: true });
  gulp.watch('app/templates/**/*.jade', ['jade']);
  gulp.watch('app/sass/**/*.scss', ['sass']);
});

gulp.task('clean', function(cb) {
  del(['public/js/*.js*', 'public/css/*.css*'], cb);
});


// JavaScript
// --------------------------------------------------

gulp.task('watchify', function() {
  var running, bundler = watchify(browserify(['./app/js/app.jsx', './app/js/ui.js'], watchify.args));

  function rebundle() {
    var timer = $.duration('Finished ' + chalk.cyan('\'watchify\'') + ' after');
    if (running) { $.util.log('Starting ' + chalk.cyan('\'watchify\'') + '...'); }
    running = true;

    return bundler
      .bundle()
      .on('error', $.notify.onError())
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('public/js'))
      .pipe(timer)
      .pipe($.size({ title: 'watchify' }))
      .pipe($.livereload());
  }

  bundler.transform(babelify)
  .on('update', rebundle);
  return rebundle();
});

gulp.task('browserify', function() {
  return browserify(['./app/js/app.jsx', './app/js/ui.js'])
    .transform(babelify)
    .bundle()
    .on('error', $.notify.onError())
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.uglify())
    .pipe(gulp.dest('public/js'))
    .pipe($.size({ title: 'browserify' }));
});

gulp.task('browserify-post', function() {
  return browserify(['./app/js/app.jsx', './app/js/ui.js'])
    .transform(babelify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.uglify())
    .pipe(gulp.dest('public/js'));
});


// Sass
// --------------------------------------------------

gulp.task('sass', function() {
  return gulp.src('app/sass/base.scss')
    .pipe($.if(env.dev, $.sourcemaps.init()))
    .pipe($.sass({ errLogToConsole: true }))
    .on('error', $.notify.onError())
    .pipe($.autoprefixer('last 2 versions'))
    .pipe($.rename('core.css'))
    .pipe($.if(env.dev, $.sourcemaps.write('.')))
    .pipe($.if(env.prod, $.csso()))
    .pipe(gulp.dest('public/css'))
    .pipe($.size({ title: 'sass' }))
    .pipe($.if(env.dev, $.livereload()));
});

gulp.task('sass-post', function() {
  return gulp.src('app/sass/base.scss')
    .pipe($.sass({ errLogToConsole: true }))
    .pipe($.autoprefixer('last 2 versions'))
    .pipe($.rename('core.css'))
    .pipe($.csso())
    .pipe(gulp.dest('public/css'));
});


// Jade
// --------------------------------------------------

gulp.task('jade', function() {
  return gulp.src('app/templates/*.jade')
    .pipe($.jade())
    .on('error', $.notify.onError())
    .pipe(gulp.dest('public'))
    .pipe($.size({ title: 'jade' }))
    .pipe($.if(env.dev, $.livereload()));
});

gulp.task('jade-post', function() {
  return gulp.src('app/templates/*.jade')
    .pipe($.jade())
    .pipe(gulp.dest('public'));
});
