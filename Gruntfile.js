// Generated on 2013-11-04 using generator-angular-component 0.2.3
'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  // Project configuration
  grunt.initConfig({
    pkg: require('./package.json'),
    bower: require('./bower.json'),
    yo: {
      // Configurable paths
      name: '<%= pkg.name %>',
      src: require('./bower.json').appPath || 'src',
      dist: 'dist'
    },
    meta: {
      banner: '/**\n' +
      ' * <%= pkg.name %>\n' +
      ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
      ' * @link <%= pkg.homepage %>\n' +
      ' * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
      ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
      ' */\n'
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },
    watch: {
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'karma:unit']
      },
      less: {
        files: ['{.tmp,docs,<%= yo.src %>}/**/*.less'],
        tasks: ['less:dev']
      },
      app: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '{.tmp,docs,<%= yo.src %>}/{,*/}*.html',
          '{.tmp,docs,<%= yo.src %>}/styles/{,*/}*.css',
          '{.tmp,docs,<%= yo.src %>}/{,*/}*.json',
          '{.tmp,docs,<%= yo.src %>}/scripts/{,*/}*.js',
          '{.tmp,docs,<%= yo.src %>}/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    connect: {
      options: {
        // Use a system-assigned port.
        port: 51903,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: true
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            'docs'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yo.src %>'
          ]
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yo.dist %>/*',
            '!<%= yo.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    less: {
      options: {
        paths: ['<%= yo.src %>']
      },
      dev: {
        options: {
          dumpLineNumbers: false,
        },
        files: {
          '<%= yo.src %>/<%= pkg.name %>.css': ['<%= yo.src %>/{,*/}*.less']
        }
      },
      dist: {
        options: {
          cleancss: true,
          report: 'gzip'
        },
        files: {
          '<%= yo.dist %>/<%= pkg.name %>.min.css': ['<%= yo.src %>/{,*/}*.less']
        }
      }
    },
    jshint: {
      src: {
        options: {
          jshintrc: '.jshintrc',
          ignores: ['<%= yo.src %>/{,*/}*.tpl.js']
        },
        src: [
          'Gruntfile.js',
          '<%= yo.src %>/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      }
    },
    karma: {
      options: {
        configFile: 'test/karma.conf.js',
        browsers: ['PhantomJS']
      },
      unit: {
        singleRun: true
      },
      server: {
        autoWatch: true
      }
    },
    concat: {
      options: {
        stripBanners: true
      },
      banner: {
        options: {
          banner: '<%= meta.banner %>',
        },
        files: {
          '<%= yo.dist %>/<%= pkg.name %>.js': ['<%= yo.dist %>/<%= pkg.name %>.js' ],
          '<%= yo.dist %>/<%= pkg.name %>.min.js': ['<%= yo.dist %>/<%= pkg.name %>.min.js' ],
          '<%= yo.dist %>/<%= pkg.name %>.css': ['<%= yo.src %>/<%= pkg.name %>.css' ],
          '<%= yo.dist %>/<%= pkg.name %>.min.css': ['<%= yo.dist %>/<%= pkg.name %>.min.css' ]
        }
      },
      dist: {
        options: {
          // Replace all 'use strict' statements in the code with a single one at the top
          banner: '(function(window, document, undefined) {\n\'use strict\';\n',
          footer: '\n})(window, document);\n',
          process: function(src, filepath) {
            return '// Source: ' + filepath + '\n' +
              src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          }
        },
        files: {
          '<%= yo.dist %>/<%= pkg.name %>.js': [
            '<%= yo.src %>/{,*/}*.js'
          ]
        }
      }
    },
    ngmin: {
      options: {
        expand: true
      },
      dist: {
        files: {
          '<%= yo.dist %>/<%= yo.name %>.js': ['<%= yo.dist %>/<%= yo.name %>.js']
        }
      }
    },
    ngtemplates: {
      options: {
        module: 'mgcrea.pullToRefresh',
      },
      dev: {
        cwd: 'src',
        src: '{,*/}*.html',
        dest: '<%= yo.src %>/<%= yo.name %>.tpl.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>',
        report: 'gzip'
      },
      dist: {
        files: {
          '<%= yo.dist %>/<%= yo.name %>.min.js': ['<%= Object.keys(ngmin.dist.files)[0] %>']
        }
      }
    }
  });

  grunt.registerTask('server', [
    'clean:server',
    'less:dev',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('test', [
    'jshint',
    'karma:unit'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'less:dev',
    'less:dist',
    'ngtemplates:dev',
    'concat:dist',
    'ngmin:dist',
    'uglify:dist',
    'concat:banner'
  ]);

  grunt.registerTask('release', [
    'test',
    'bump-only',
    'dist',
    'bump-commit'
  ]);

  grunt.registerTask('default', ['build']);

};
