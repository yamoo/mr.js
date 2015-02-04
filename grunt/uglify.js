// uglify task

'use strict';

module.exports = {
  dist: {
    files: {
      '<%= path.dist %>/mr.min.js': '<%= path.dist %>/mr.js'
    }
  }
};
