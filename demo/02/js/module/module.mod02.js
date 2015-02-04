window.$MR.define('Mod02', function ($, $MR) {
    'use strict';

    var Utils = $MR.Utils,
        View,
        Model;

    View = Utils.extend($MR.View, {

        events: {
            'click': '_render'
        },

        _init: function() {
            var value;

            value = this.$el.text()-0;

            this.model = new Model({
                data: value
            });

            this._delegate();
        },

        _render: function() {
            this.model.increment();
            this.$el.text(this.model.data);
        }
    });

    Model = Utils.extend($MR.Model, {

        data: 0,

        increment: function() {
            this.data++;
        }
    });

    return {
        View: View,
        Model: Model
    };
});