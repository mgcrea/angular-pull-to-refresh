'use strict';

module.exports = function (grunt) {

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    app: 'src',
    dist: 'dist',
    name: 'pull-to-refresh'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/**\n' +
      ' * <%= pkg.description %>\n' +
      ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
      ' * @link <%= pkg.homepage %>\n' +
      ' * @author <%= pkg.author %>\n' +
      ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
      ' */\n'
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/{,*/}*.js'
      ]
    },
    karma: {
      options: {
        configFile: 'test/karma.conf.js',
        browsers: ['Chrome'] // PhantomJS
      },
      unit: {
        singleRun: true
      },
      server: {
        autoWatch: true
      }
    },
    less: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        files: {
          '<%= yeoman.dist %>/<%= yeoman.name %>.css': '<%= yeoman.app %>/<%= yeoman.name %>.less'
        }
      }
    },
    cssmin: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        files: {
          '<%= yeoman.dist %>/<%= yeoman.name %>.min.css': '<%= yeoman.dist %>/<%= yeoman.name %>.css'
        }
      }
    },
    ngmin: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        files: {
          '<%= yeoman.dist %>/<%= yeoman.name %>.js': '<%= yeoman.app %>/<%= yeoman.name %>.js'
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        files: {
          '<%= yeoman.dist %>/<%= yeoman.name %>.min.js': '<%= yeoman.dist %>/<%= yeoman.name %>.js'
        }
      }
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json']
      },
      dist: {
        options: {
          commit: false,
          push: false,
          createTag: false
        }
      },
      push: {
        options: {
          bump: false,
          commitMessage: 'feat(release): bump v<%= pkg.version %>',
          tagMessage: 'feat(release): bump v<%= pkg.version %>',
          commitFiles: ['-a'],
          pushTo: 'github'
        }
      }
    }
  });

  grunt.registerTask('test', [
    'karma:unit'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'less:dist',
    'cssmin:dist',
    'ngmin:dist',
    'uglify:dist'
  ]);

  grunt.registerTask('release', [
    'bump:dist',
    'build'
  ]);

  grunt.registerTask('push', [
    // 'bump:dist',
    // 'build',
    'bump:push'
  ]);

  grunt.registerTask('default', ['build']);

};
