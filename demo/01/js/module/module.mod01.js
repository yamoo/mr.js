window.$MR.define('Mod01', function ($, $MR) {
    'use strict';

    var Mod01;

    Mod01 = function() {
        this._init();
    };

    Mod01.prototype = {
        _init: function() {
            $('body').append('Mod01');
        }
    };

    return Mod01;
});