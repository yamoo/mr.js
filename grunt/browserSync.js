// Start BrowserSync server
//
// grunt-browser-sync: <https://github.com/shakyShane/grunt-browser-sync>
// BrowserSync: <http://www.browsersync.io/>
// Options: <http://www.browsersync.io/docs/options/>

'use strict';

module.exports = function () {

  var routes = {};
  routes['/bower_components'] = 'bower_components';
  routes['/dist'] = '<%= path.dist %>';

  return {
    // Dev server
    app: {
      options: {
        server: {
          baseDir: [
            '<%= path.demo %>',
          ],
          routes: routes
        },
        port: 9000,
        notify: false,
        watchTask: true
      },
      src: [
        '<%= path.app %>/**',
        '<%= path.demo %>/**',
        '!<%= path.distIgnore %>'
      ]
    },

    // Server using dist files
    dist: {
      options: {
        server: {
          baseDir: [
            '<%= path.dist %>'
          ]
        },
        port: 9001,
        notify: false
      }
    }
  };

};
