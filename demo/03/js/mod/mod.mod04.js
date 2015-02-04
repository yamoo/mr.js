window.$MR.define('Mod04', function ($, $MR) {
    'use strict';

    var Utils = $MR.Utils,
        Mod04;

    Mod04 = Utils.extend($MR.View, {

        defaults: {
            delta: 30
        },

        events: {
            'click .js-click': '_render'
        },

        _init: function() {
            this._delegate();
        },

        _render: function() {
            var width = this.$('.js-click').width() + this.settings.delta;

            this.$('.js-click').width(width);
        }
    });

    return Mod04;
});