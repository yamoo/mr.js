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
