/* ===========
 * Proyecto: Módulos
 * Fecha Inicio: 08/04/2018
 * Email Desarrollador: wesleyaltamiranda@gmail.com
 * ======== */

'use strict';
var custom = custom || {};

custom = (function($, doc, win, undefined) {
  var p = this,
  _pages      = function() {},
  _components = function() {},
  _modules    = function() {},
  _services   = function() {},
  _cache      = function() {},

  _init = function() {
    custom.pages.common.init();

    $.each(custom.pages, function () {
      $('body').hasClass(this.pageClass) && this.hasOwnProperty('init') && this.init();
    });
  },

  _constructor = (function() {
    var _page = function(pageClass) {
      var s = this;
      s.pageClass = pageClass;

      s.DOMReady = function() {};
      s.winLoad  = function() {};

      var _DOMReady = function() {
        $(doc).ready(function () {
          s.DOMReady();
        });
      },

      _winLoad = function() {
        s.winLoad();
      };

      s.init = function() {
        _DOMReady(), _winLoad();
      };

      /*s.DOMReady = function (callback) {
        $(doc).ready(function () {
          $('body').hasClass(this.pageClass) && typeof callback === "function" && callback();
        });
      }*/
    };

    return {
      page:  _page,
    }
  })();

  return {
    contructor: _constructor,
    init:       _init,
    pages:      _pages,
    components: _components,
    modules:    _modules,
    services:   _services,
    cache:      _cache
  }
})(jQuery, document, window);


(function($, doc, win, undefined) {
  custom.pages.common = new custom.contructor.page('common');
  custom.pages.common.DOMReady = function() {
    console.log('DOMReady Common');
  };
})(jQuery, document, window);

(function($, doc, win, undefined) {
  custom.pages.home = new custom.contructor.page('home');
  custom.pages.home.DOMReady = function() {
    console.log('DOMReady Página Home');
  };
})(jQuery, document, window);

custom.init();