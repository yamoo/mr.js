// Inject Bower components into source code
//
// grunt-wiredep: <https://github.com/stephenplusplus/grunt-wiredep>
// wiredep: <https://github.com/taptapship/wiredep>

'use strict';

module.exports = {

  markups: {
    src: ['<%= path.markups %>/**/*.html']
    // Force absolute URL
    // "../bower_components/xxxx" -> "/bower_components/xxxx"
    //ignorePath: /(\.\.\/)*\.\.(?=\/)/
  }

};
