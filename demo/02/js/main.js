;(function($, $MR) {
    'use strict';

    var Utils = $MR.Utils,
        Mod02;

    Mod02 = $MR.require('Mod02');

    $(function() {
        var mod02View;

        mod02View = Utils.applyModule('.js-click', Mod02.View);
    });

})(window.jQuery, window.$MR);