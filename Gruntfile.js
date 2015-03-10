// CapCrunch Build
// ==================================================

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({

    sass: {
      dev: {
        options: {
          sourceMap: true
        },
        files: {
          'public/css/core.css': 'public/css/base.scss'
        }
      },
      dist: {
        options: {
          sourceMap: false,
          outputStyle: 'compressed'
        },
        files: {
          'public/css/dist.css': 'public/css/base.scss'
        }
      }
    },


    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        loopfunc: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        browser: true,
        debug: true,
        devel: true,
        globals: {
          'io': true,
          '$': false,
          'jQuery': true,
          'module': true,
          'require': false,
          'process': false,
          '__dirname': false
        }
      },
      files: ['Gruntfile.js',
              'server.js',
              'public/js/client.js']
    },


    uglify: {
      dist: {
        files: {
          'public/js/client.min.js': 'public/js/client.js'
        }
      }
    },


    concat: {
      options: {
        stripBanners: true
      },
      dist: {
        src: ['public/js/vendor/modernizr.min.js',
              'public/js/vendor/socket.io.min.js',
              'public/js/vendor/jquery.min.js',
              'public/js/client.min.js'],
        dest: 'public/js/dist.js'
      }
    },


    jasmine: {
      test: {
        src: 'public/js/client.js',
        options: {
          vendor:  ['public/js/vendor/jquery.min.js',
                    'public/js/vendor/socket.io.min.js'],
          helpers: ['spec/helpers/jasmine-jquery.js'],
          specs: 'spec/*Spec.js',
          keepRunner: true
        }
      }
    },


    preprocess: {
      dev: {
        options: {
          context: { ENV: 'DEV' }
        },
        src :  'tmpl/index.html',
        dest : 'public/index.html'
      },
      dist: {
        options: {
          context: { ENV: 'DIST' }
        },
        src :  'tmpl/index.html',
        dest : 'public/index.html'
      }
    },


    watch: {
      sass: {
        files: ['public/css/**/*.scss'],
        tasks: ['sass:dev']
      },
      js: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint']
      },
      test: {
        files: ['spec/**/*.js', 'tmpl/**/*.html'],
        tasks: ['test']
      },
      html: {
        files: ['tmpl/**/*.html'],
        tasks: ['preprocess:dev']
      },
      options: {
        livereload: true
      }
    }
  });


  // Dependencies
  // --------------------------------------------------

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');


  // Tasks
  // --------------------------------------------------

  grunt.registerTask('default', ['sass:dev', 'jshint', 'jasmine', 'preprocess:dev']);
  grunt.registerTask('dev', ['sass:dev', 'jshint', 'jasmine', 'preprocess:dev', 'watch']);
  grunt.registerTask('dist', ['sass:dist', 'jshint', 'jasmine', 'uglify', 'concat', 'preprocess:dist']);
  grunt.registerTask('test', ['jshint', 'jasmine']);


  require('time-grunt')(grunt);
};
