// CapCrunch Build
// ==================================================

var gulp        = require('gulp'),
    glob        = require('glob'),
    del         = require('del'),
    browserify  = require('browserify'),
    sequence    = require('run-sequence'),
    source      = require('vinyl-source-stream'),
    $           = require('gulp-load-plugins')(),
    pkg         = require('./package.json'),
    env         = {
      flag      : process.env.NODE_ENV,
      prod      : (this.flag === 'production'),
      dev       : (this.flag !== 'production' || this.flag !== 'test')
    };


// default
gulp.task('default', ['clean', 'js', 'sass', 'jade', 'watch']);


// ship
gulp.task('ship', ['clean', 'jade'], function(cb) {
  env.prod = true;
  env.dev  = false;
  sequence(['js', 'sass'], cb);
});


// clean
gulp.task('clean', function(cb) {
  del(['public/js/*.js', 'public/css/*.css', 'public/index.html'], cb);
});


// watch
gulp.task('watch', function() {
  $.livereload.listen({ quiet: true });
  gulp.watch(['gulpfile.js', 'server.js', 'app/js/**/*.js'], ['js']);
  gulp.watch('app/sass/**/*.scss', ['sass']);
  gulp.watch('app/templates/**/*.jade', ['jade']);
});


// javascript
gulp.task('js', function() {
  return browserify({
      entries : ['./app/js/core.js'],
      debug   : env.dev
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe($.if(env.prod, $.streamify($.uglify())))
    .pipe(gulp.dest('public/js'))
    .pipe($.streamify($.size({ title: 'js' })))
    .pipe($.livereload());
});


// sass
gulp.task('sass', function() {
  return gulp.src('app/sass/base.scss')
    .pipe($.if(env.dev, $.sourcemaps.init()))
    .pipe($.sass({ errLogToConsole: true }))
    .pipe($.if(env.dev, $.sourcemaps.write('.')))
    .pipe($.if(env.prod, $.uncss({ html: glob.sync('public/*.html') })))
    .pipe($.if(env.prod, $.csso()))
    .pipe(gulp.dest('public/css'))
    .pipe($.size({ title: 'sass' }))
    .pipe($.livereload());
});


// jade
gulp.task('jade', function() {
  return gulp.src('app/templates/index.jade')
    .pipe($.jade({ locals: pkg }))
    .pipe(gulp.dest('public'))
    .pipe($.size({ title: 'jade' }))
    .pipe($.livereload());
});




// grunt

/*  jshint: {
    options: { curly: true, eqeqeq: true, immed: true, loopfunc: true, latedef: true, newcap: true, noarg: true, sub: true, undef: true, unused: true, browser: true, debug: true, devel: true,
      globals: { 'io': true, '$': false, 'jQuery': true, 'module': true, 'require': false, 'process': false, '__dirname': false } },
    all: { src: ['Gruntfile.js', 'server.js', 'public/js/client.js'] }

  jasmine: {
    test: { src: 'public/js/client.js', options: {
        vendor:  ['public/js/vendor/jquery.min.js', 'public/js/vendor/socket.io.min.js'],
        helpers: ['spec/helpers/jasmine-jquery.js'],
        specs: 'spec/*Spec.js', keepRunner: true } }

  watch: {
    js: { files: ['<%= jshint.all.src %>'], tasks: ['lint'] },
    test: { files: ['spec/../.....js'], tasks: ['test'] } */
