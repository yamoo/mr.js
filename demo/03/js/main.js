;(function($, $MR) {
    'use strict';

    var _init;

    _init = function(Mod03, Mod04) {
        var mod03,
            mod04;

        mod03 = $MR.applyModule('.js-widget-a', Mod03.View);
        mod04 = $MR.applyModule('.js-widget-b', Mod04);
    };

    $(function() {
        $.when(
            $MR.require('Mod03'),
            $MR.require('Mod04')
        ).done(_init);
    });

})(window.jQuery, window.$MR);