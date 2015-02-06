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