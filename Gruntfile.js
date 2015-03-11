// CapCrunch Build
// ==================================================

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),


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
          sourceMap: false
        },
        files: {
          'public/css/dist.css': 'public/css/base.scss'
        }
      }
    },


    uncss: {
      dist: {
        options: {
          report: 'gzip'
        },
        files: {
          'public/css/dist.css': ['http://localhost:3000']
        }
      }
    },


    cssmin: {
      dist: {
        files: {
          'public/css/dist.css': ['public/css/dist.css']
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
      all: {
        src: ['Gruntfile.js', 'server.js', 'public/js/client.js']
      }
    },


    uglify: {
      all: {
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
      options: {
        context: { VERSION: '<%= pkg.version %>' }
      },
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
        files: ['<%= jshint.all.src %>'],
        tasks: ['lint']
      },
      test: {
        files: ['spec/**/*.js'],
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

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-uncss');
  grunt.loadNpmTasks('grunt-sass');


  // Tasks
  // --------------------------------------------------

  grunt.registerTask('default', ['sass:dev', 'test', 'preprocess:dev']);
  grunt.registerTask('dev',     ['sass:dev', 'lint', 'preprocess:dev', 'watch']);
  grunt.registerTask('dist',    ['sass:dist', 'test', 'zip', 'preprocess:dist', 'css']);
  grunt.registerTask('minify',  ['newer:uglify:all']);
  grunt.registerTask('lint',    ['newer:jshint:all']);
  grunt.registerTask('test',    ['lint', 'jasmine']);
  grunt.registerTask('zip',     ['minify', 'concat']);
  grunt.registerTask('css',     ['uncss', 'cssmin']);


  require('time-grunt')(grunt);
};
