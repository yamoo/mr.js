// concat task

'use strict';

module.exports = {
  dist: {
    src: [
      '<%= path.app %>/**/mr.js',
      '<%= path.app %>/**/const.js',
      '<%= path.app %>/**/utils.js',
      '<%= path.app %>/**/*.js'
    ],
    dest: '<%= path.dist %>/mr.js'
  }
};
