// Grunt base configuration
//
// This Gruntfile.js is based on "load-grunt-config" module.
// Config files are separated and put into `grunt/` directory.
// load-grant-config: <https://github.com/firstandthird/load-grunt-config>

'use strict';

module.exports = function (grunt) {

  // Display the execution time.
  require('time-grunt')(grunt);

  // Initialize with "load-grunt-config".
  require('load-grunt-config')(grunt, {

    // Define variables for grunt config here.
    config: {
      path: {
        app:        'src',
        demo:       'demo',
        dist:       'dist',
        distIgnore: '**/_*/**',     // Excluded directories or files of distribution, e.g. Sass directory.
        tmp:        '.tmp/dist',
        markups:    'demo',
        styles:     'demo/css',
        scripts:    'demo/js',
        images:     'demo/img',
        html:       'demo',
        css:        'demo/css',
        js:         'demo/js'
      }
    }

  });

};
