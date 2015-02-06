/**
 * [description]
 * @return {[type]}      [description]
 */
window.$MR.Bone = (function($, $MR) {
    'use strict';

    var Bone;

    /**
     * [Bone description]
     */
    Bone = function() {
        this.__moduleId = $MR.Utils.uniqueId('m');
        this.__listeningTbl = {};
    };

    Bone.prototype = {
        _bind: function(fn) {
            return $.proxy(this[fn], this);
        },

        on: function(event, callback, target) {
            var tbl = this.__listeningTbl;

            tbl[event] = tbl[event] || [];
            tbl[event].push({
                target: target || this,
                callback: callback
            });
        },

        off: function(event, callback, target) {
            var tbl = this.__listeningTbl[event],
                query = {
                    target: target || this
                },
                result,
                i;

            if (callback) {
                query.callback = callback;
            }

            for (i=0; i<tbl.length; i++) {
                result = $MR.Utils.where([tbl[i]], query);

                if (result) {
                    tbl.splice(i, 1);
                    i--;
                }
            }
        },

        trigger: function(event) {
            var tbl = this.__listeningTbl[event] || [];

            $.each(tbl, function(i, item) {
                item.callback.apply(item.target);
            });
        },

        listenTo: function(target, event, callback) {
            target.on(event, callback, this);
        },

        stopListening: function(target, event, callback) {
            target.off(event, callback, this);
        }
    };

    return Bone;

})(jQuery, window.$MR);