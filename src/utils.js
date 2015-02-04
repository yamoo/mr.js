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
        applyModule,
        template,
        where;

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

    applyModule = function(el, TargetModule, config) {
        var _instances = [];

        if (TargetModule) {
            if (el) {
                $(el).each(function() {
                    _instances.push(new TargetModule($.extend({
                        el: this,
                        instances: _instances
                    }, config)));
                });
            } else {
                _instances.push(new TargetModule($.extend({
                    instances: _instances
                }, config)));
            }
        } else {
            throw new Error('Failed applyModule for "' + el +'". Module was not found.');
        }

        return _instances;
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
        applyModule: applyModule,
        template: template,
        where: where
    };
})(jQuery, window.$MR);