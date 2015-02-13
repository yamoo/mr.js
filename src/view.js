/**
 * [description]
 * @return {[type]}        [description]
 */
window.$MR.View = (function($, $MR) {
    'use strict';

    var View;

    View = $MR.Utils.extend($MR.Bone, {

        defaults: {},

        events: {},

        _create: function(options) {
            this.el = options.el;
            this.$el = $(this.el);
            this.model = options.model;
            this.settings = $.extend({}, this.defaults, options, this.$el.data('options'));
            this._init();
        },

        _init: function() {
        },

        _mkCache: function() {
            this.settings.cache = {
                $: {}
            };

            return this.settings.cache;
        },

        $: function(selector, nocache) {
            var settings = this.settings,
                cache = settings.cache || this._mkCache(),
                prefix = (settings.selector && settings.selector.prefix) || '',
                css = selector.replace(/\$/g, prefix),
                $el;

            if (nocache || typeof cache.$[selector] === 'undefined') {
                $el = this.$el.find(css);

                if ($el[0]) {
                    cache.$[selector] = $el;
                } else {
                    cache.$[selector] = null;
                }
            }

            return cache.$[selector];
        },

        _delegateEvent: function(events, target, swc) {
            var self = this,
                _target = target || self.$el,
                _events = events || self.events,
                tagElemsRegexp = /^#|^\.|^\[|^button|^label|^input|^select|^option|^textarea|^img|^ul|^li|^span|^div/;

            $.each(_events, function(eventName, handler) {
                var args = eventName.split(' '),
                    argsLen = args.length,
                    _handler = self._bind(handler),
                    isHasChildElement = (argsLen > 1) && tagElemsRegexp.test(args[argsLen-1].toLowerCase());

                if (isHasChildElement) {
                    args = [args.slice(0, argsLen-1).join(' '), args[argsLen-1]];
                    args.push(_handler);
                    _target[swc].apply(_target, args);
                } else {
                    _target[swc](eventName, _handler);
                }
            });
        },

        _delegate: function(events, target) {
            this._delegateEvent(events, target, 'on');
        },

        _undelegate: function(events, target) {
            this._delegateEvent(events, target, 'off');
        }
    });

    return View;

})(jQuery, window.$MR);