window.$MR.define('Mod03', function ($, $MR) {
    'use strict';

    var Utils = $MR.Utils,
        View,
        Model;

    View = Utils.extend($MR.View, {

        events: {
            'click .js-click': '_click'
        },

        _init: function() {
            var value;

            value = this.$el.text()-0;

            this.model = new Model({
                data: value
            });

            this.listenTo(this.model, 'change', this._bind('_render'));
            this._delegate();
        },

        _click: function() {
            this.model.increment();
        },

        _render: function() {
            this.$('.js-click').text(this.model.data);
        }
    });

    Model = Utils.extend($MR.Model, {

        data: 0,

        increment: function() {
            this.data++;
            this.trigger('change');
        }
    });

    return {
        View: View,
        Model: Model
    };
});