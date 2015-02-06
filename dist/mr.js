/**
 * [description]
 * @return {[type]}        [description]
 */
window.$MR = (function($) {
    'use strict';

    var Module,
        Define,
        getModulePath,
        define,
        require,
        applyModule;

    if (typeof $ === 'undefined') {
        throw new Error('mr.js depends on jQuery.');
    }

    /**
     * [Module description]
     * @type {Object}
     */
    Module = {};

    /**
     * [Define description]
     * @type {Object}
     */
    Define = {};

    /**
     * [getModulePath description]
     * @return {[type]} [description]
     */
    getModulePath = function() {
        var Const = window.$MR.Const,
            $script,
            baseDir,
            moduleDir,
            modulePrefix,
            modulePath;

        $script = $('script').filter('[src$="' + Const.scriptName + '"]').eq(0);

        if (!$script[0]) {
            throw new Error('mr.js was not found. you need to change Const.scriptName if you changed the file name.');
        }

        baseDir = Const.baseDir || $script.attr('src').replace(/(.+\/).*$/, '$1');
        moduleDir = Const.moduleDir;
        modulePrefix = Const.modulePrefix;

        if (!/\/$/.test(baseDir)) {
            baseDir += '/';
        }

        if (!/\/$/.test(moduleDir)) {
            moduleDir += '/';
        }

        if (!/\.$/.test(modulePrefix)) {
            modulePrefix += '.';
        }

        modulePath = baseDir + moduleDir + modulePrefix;

        getModulePath = function() {
            return modulePath;
        };

        return modulePath;
    };

    /**
     * [Define description]
     * @param {[type]} name   [description]
     * @param {[type]} module [description]
     */
    define = function(name, module) {
        Define[name] = module;
    };

    /**
     * [require description]
     * @return {[type]} [description]
     */
    require = function(name) {
        var $MR = window.$MR,
            TargetModule,
            loader,
            script;

        if (!Module[name]) {
            if (Define[name]) {
                TargetModule = Define[name]($, $MR);

                if (typeof TargetModule === 'object') {
                    Module[name] = {};
                } else {
                    TargetModule = [ TargetModule ];
                    Module[name] = [];
                }

                $.each(TargetModule, function(_name, _define) {
                    Module[name][_name] = _define;
                });

                if (Module[name].length) {
                    Module[name] = Module[name][0];
                }

            } else {
                if (window[name]) {
                    Module[name] = window[name];
                } else {
                    loader = $.Deferred();
                    script = getModulePath() + name.toLowerCase() + '.js';

                    $.getScript(script)
                        .done(function() {
                            loader.resolve(require(name));
                        })
                        .fail(function() {
                            throw new Error(script + ' is not found.');
                        });
                    return loader.promise();
                }
            }
        }

        if (!Module[name]) {
            throw new Error(name + ' module is not defined.');
        }

        return Module[name];
    };

    /**
     * [applyModule description]
     * @param  {[type]} el           [description]
     * @param  {[type]} TargetModule [description]
     * @param  {[type]} config       [description]
     * @return {[type]}              [description]
     */
    applyModule = function(el, TargetModule, config) {
        var _instances = [];

        if (el && TargetModule ) {
            $(el).each(function() {
                _instances.push(new TargetModule($.extend({
                    el: this,
                    instances: _instances
                }, config)));
            });
        } else {
            throw new Error('Failed applyModule for "' + el +'". el or Module was not found.');
        }

        return _instances;
    };

    return {
        require: require,
        define: define,
        applyModule: applyModule
    };
}(window.jQuery));
/**
 * [description]
 * @return {[type]}      [description]
 */
window.$MR.Const = (function($, $MR) {
    'use strict';

    return {
        scriptName: 'mr.min.js',
        moduleDir: 'module/',
        modulePrefix: 'module.'
    };

})(jQuery, window.$MR);
/**
 * [description]
 * @return {[type]}        [description]
 */
window.$MR.Utils = (function($, $MR) {
    'use strict';

    var _idCounter,
        ua,
        transitionend,
        animationend,
        hasCookie,
        getCookie,
        setCookie,
        deleteCookie,
        getStorageItem,
        setStorageItem,
        uniqueId,
        extend,
        template,
        where;

    _idCounter = 0;

    ua = function() {
        var userAgent = window.navigator.userAgent.toLowerCase(),
            ua = 'other';

        if (/android/.test(userAgent)) {
            ua = 'android';

            if(!(/chrome/.test(userAgent))) {
                $('html').addClass('android');

                if (/android 2/.test(userAgent)) {
                    ua = 'android2';
                    $('html').addClass('android2');
                }
            } else {
                $('html').addClass('chrome');
            }
        } else if (/ipod|iphone|ipad/.test(userAgent)) {
            ua ='ios';
            $('html').addClass('ios');
        } else if (/msie/.test(userAgent)) {
            ua = 'ie';
            $('html').addClass('ie');
        }

        return ua;
    };

    transitionend = function() {
        var fakeElement = document.createElement('fakeelement'),
            transitionendEvents = {
                webkitTransition: 'webkitTransitionEnd',
                transition: 'transitionend',
                oTransition: 'oTransitionEnd'
            },
            transitionend;

        if (Object.keys) {
            Object.keys(transitionendEvents).forEach(function(key) {
                if (fakeElement.style[key] !== undefined && !transitionend) {
                    transitionend = transitionendEvents[key];
                    return false;
                }
            });
        }

        return transitionend;
    };

    animationend = function() {
        var fakeElement = document.createElement('fakeelement'),
            animationendEvents = {
                webkitAnimation: 'webkitAnimationEnd',
                animation: 'animationend',
                oAnimation: 'oAnimationEnd'
            },
            animationend;

        if (Object.keys) {
            Object.keys(animationendEvents).forEach(function(key) {
                if (fakeElement.style[key] !== undefined && !animationend) {
                    animationend = animationendEvents[key];
                    return false;
                }
            });
        }

        return animationend;
    };

    hasCookie = function(name, options) {
        var _hasCookie = (this.getCookie(name, options) !== null) ? true : false;

        return _hasCookie;
    };

    getCookie = function(name, options) {
        var ret = null,
            _options = options || {},
            _regexp,
            _cookie,
            _name = name,
            _label;

        if (_options.delimiter) {
            _name = name.split(_options.delimiter)[0];
            _label = name.split(_options.delimiter)[1];
            _regexp = _name + '\\=(?:.*?)' + _label + '\\=(.*?)(?:\\' + _options.delimiter + '|\\;|$)';
        } else {
            _regexp = _name + '\\=(.*?)(?:\\;|$)';
        }
console.log(_regexp)
        _cookie = decodeURIComponent(document.cookie).match(new RegExp(_regexp));

        if (_cookie && _cookie.length > 1) {
            ret = _cookie[1];
        }

        return ret;
    };

    setCookie = function(name, value, options) {
        var _options =  options || {},
            _regexp,
            _cookie,
            _name = name,
            _label,
            _value = '',
            _path = 'path=/;',
            _expire = '';

        if (_options.delimiter) {
            _name = name.split(_options.delimiter)[0];
            _label = name.split(_options.delimiter)[1];
        }

        _regexp = new RegExp(_name + '\\=(.*?)(?:\\;|$)');
        _cookie = decodeURIComponent(document.cookie).match(_regexp);

        if (_options.path) {
            _path = 'path=' + _options.path + ';';
        }

        if (_options.expire) {
            _expire = 'expires=' + new Date(_options.expire).toGMTString() + ';';
        }

        if (_options.delimiter) {
            if (_cookie && _cookie.length > 1) {
                _value = _cookie[1].replace(new RegExp(_label + '\\=(.*?)(?:\\' + _options.delimiter + '|\\;|$)'), '');
            }

            if (value) {
                if (_value) {
                    _value += _options.delimiter;
                }
                _value = _value + (_label + '=' + value);
            }
        } else {
            _name = name;
            _value = value;
        }

        document.cookie = _name + '=' + encodeURIComponent(_value) + ';' + _path + _expire;

        return encodeURIComponent(document.cookie);
    };

    deleteCookie = function(name, options) {
        var _options = options || {};

        if (!_options.delimiter) {
            _options = $.extend(true, {}, {
                expire: '1970/1/1'
            });
        }

        return this.setCookie(name, '', _options);
    };

    getStorageItem = function(key) {
        var result = {
                error: false,
                data: null
            };

        if (window.localStorage) {
            try {
                result.data = window.localStorage.getItem(key);
            } catch(e) {
                result.error = true;
                return result;
            }
        }
        return result;
    };

    setStorageItem = function(key, value) {
        var result = {
                error: false
            };

        if (window.localStorage) {
            try {
                window.localStorage.setItem(key, value);
            } catch(e) {
                result.error = true;
            }
        }
        return result;
    };

    uniqueId = function(prefix) {
        var id = ++_idCounter + '';

        return prefix ? prefix + id : id;
    };

    extend = function(Super, Sub) {
        var TmpSuper = function() {},
            SubConstrutor,
            SubPrototype,
            Constructor;

        if (typeof Sub === 'object') {
            SubConstrutor = Sub._create || function() {};
            SubPrototype = Sub;
        } else {
            SubConstrutor = Sub;
            SubPrototype = Sub.prototype;
        }

        Constructor = function() {
            var args = Array.prototype.slice.call(arguments);

            Super.apply(this, args);
            SubConstrutor.apply(this, args);
        };

        TmpSuper.prototype = Super.prototype;
        Constructor.prototype = new TmpSuper();
        $.extend(Constructor.prototype, SubPrototype);

        return Constructor;
    };

    template = function (tmpl, data) {
        var _settings, _methods;

        _settings = {
            nomatch: /(.)^/,
            evaluate: /<\%(.+?)\%>/g,
            interpolate: /<\%\=(.+?)\%>/g,
            escaper: /\\|'|\r|\n|\t|\u2028|\u2029/g
        };

        _methods = {
            render: function () {
                var regexp, index, source;

                index = 0;
                source = [];

                regexp = new RegExp([
                    (_settings.interpolate || _settings.nomatch).source,
                    (_settings.evaluate || _settings.nomatch).source
                ].join('|') + '|$', 'g');

                tmpl.replace(regexp, function (match, interpolate, evaluate, offset) {
                    source.push('__t.push(\'' + tmpl.slice(index, offset).replace(_settings.escaper, '') + '\');');

                    if (interpolate) {
                        source.push('__t.push(' + interpolate + ');');
                    }

                    if (evaluate) {
                        source.push(evaluate);
                    }

                    index = offset + match.length;

                    return match;
                });

                if (index === 0) {
                    source.push('__t.push(\'' + tmpl + '\');');
                }

                source = 'var __t=[];with(__d||{}){' + source.join('\n') + '};return __t.join(\'\');';

                return new Function ('$', '__d', source).apply(null, [$, data]);
            }
        };

        return _methods.render();
    };

    where = function(array, attrs) {
        var result = {
                indexes: [],
                values: []
            };

        $.each(array, function(i, obj) {
            var isValid = true,
                key;

            for (key in attrs) {
                if (obj[key] !== attrs[key]) {
                    isValid = false;
                    break;
                }
            }

            if (isValid) {
                result.indexes.push(i);
                result.values.push(obj);
            }
        });

        if (result.indexes.length <= 0) {
            result = null;
        }

        return result;
    };

    return {
        ua: ua(),
        transitionend: transitionend(),
        animationend: animationend(),
        hasCookie: hasCookie,
        getCookie: getCookie,
        setCookie: setCookie,
        deleteCookie: deleteCookie,
        getStorageItem: getStorageItem,
        setStorageItem: setStorageItem,
        uniqueId: uniqueId,
        extend: extend,
        template: template,
        where: where
    };
})(jQuery, window.$MR);
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
/**
 * [Event descripticon]
 */
window.$MR.Event = {};
/**
 * [description]
 * @return {[type]}        [description]
 */
window.$MR.Feature = (function($, $MR){
    'use strict';

    var Touch,
        FormData,
        XHRUpload;

    Touch = function() {
        return (typeof document.ontouchstart !== 'undefined');
    };

    FormData = function() {
        return (typeof window.FormData !== 'undefined');
    };

    XHRUpload = function() {
        return ($.ajaxSettings.xhr().upload ? true : false);
    };

    return {
        Touch: Touch(),
        FormData: FormData(),
        XHRUpload: XHRUpload()
    };

})(jQuery, window.$MR);

/**
 * [description]
 */
window.$MR.messanger = new window.$MR.Bone();

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
            this.settings = $.extend({}, this.defaults, options, this.$el.data('options'));
            this._init();
        },

        _init: function() {},

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
                    isHasChildElement = tagElemsRegexp.test(args[argsLen-1].toLowerCase());

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