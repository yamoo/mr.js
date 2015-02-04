'use strict';

module.exports = function (grunt, config) {
  return {
    options: {
      dirs: [
        config.path.app + '/**/'
      ],

      livereload: {
        enabled: false
      }
    },

    //js compile
    js: function () {
      return ['build', 'newer:jshint', 'newer:jscs'];
    }
  };
};
