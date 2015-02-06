/**
 * [description]
 * @return {[type]}        [description]
 */
window.$MR.Model = (function($, $MR) {
    'use strict';

    var Model;

    Model = $MR.Utils.extend($MR.Bone, {

        defaults: {},

        _create: function(options) {
            this.settings = $.extend({}, this.defaults, options);
            this._init();
        },

        _init: function() {}
    });

    return Model;

})(jQuery, window.$MR);
