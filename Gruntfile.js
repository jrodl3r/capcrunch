module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({

    sass: {
      dev: {
        options: {
          sourceMap: true
        },
        files: {
          'css/core.css': 'css/base.scss'
        }
      },
      dist: {
        options: {
          sourceMap: false,
          outputStyle: 'compressed'
        },
        files: {
          'css/dist.css': 'css/base.scss'
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
        strict: true,
        globals: {
          '$': false,
          'jQuery': true,
          'module': true,
          'require': false
        },
        ignores: ['js/dist.js', 'js/core.min.js']
      },
      files: ['Gruntfile.js', 'js/core.js']
    },


    uglify: {
      dist: {
        files: {
          'js/core.min.js': 'js/core.js'
        }
      }
    },


    concat: {
      options: {
        stripBanners: true
      },
      dist: {
        src: ['js/vendor/modernizr.min.js', 'js/vendor/jquery.min.js', 'js/core.min.js'],
        dest: 'js/dist.js'
      }
    },


    jasmine: {
      test: {
        src: 'js/core.js',
        options: {
          vendor: ['js/vendor/jquery.min.js'],
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
        src : 'tmpl/index.html',
        dest : 'index.html'
      },
      dist: {
        options: {
          context: { ENV: 'DIST' }
        },
        src : 'tmpl/index.html',
        dest : 'index.html'
      }
    },


    watch: {
      sass: {
        files: ['css/**/*.scss'],
        tasks: ['sass:dev']
      },
      js: {
        files: ['Gruntfile.js', 'js/*.js'],
        tasks: ['jshint']
      },
      test: {
        files: ['spec/**/*.js', 'tmpl/**/*.html'],
        tasks: ['test']
      },
      html: {
        files: ['tmpl/**/*.html'],
        tasks: ['preprocess']
      },
      options: {
        livereload: true
      }
    }
  });


  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');


  grunt.registerTask('default', ['sass:dev', 'jshint', 'jasmine', 'preprocess:dev']);
  grunt.registerTask('dev', ['sass:dev', 'jshint', 'jasmine', 'preprocess:dev', 'watch']);
  grunt.registerTask('dist', ['sass:dist', 'jshint', 'jasmine', 'uglify', 'concat', 'preprocess:dist']);
  grunt.registerTask('test', ['jshint', 'jasmine']);


  require('time-grunt')(grunt);
};
