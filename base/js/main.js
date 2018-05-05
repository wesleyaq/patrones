/* ===========
 * Proyecto: Módulos
 * Fecha Inicio: 08/04/2018
 * Email Desarrollador: wesleyaltamiranda@gmail.com
 * ======== */

'use strict';

/**
 * Helpers
 */
$.js = function (el) {
  return $(js(el));
};
var js = function (el) {
  return '[data-js=' + el + ']';
};

/**
 * Base page, components, modules, services, cache
 */
var app = app || {};

app = (function($, doc, win, undefined) {
  var p = this,
  pages      = function() {},
  components = function() {},
  modules    = function() {},
  services   = function() {},
  cache      = function() {},

  init = function() {
    app.pages.common.init();

    $.each(app.pages, function () {
      $('body').hasClass(this.pageClass) && this.hasOwnProperty('init') && this.init();
    });
  },

  constructor = (function() {
    var page = function(pageClass) {
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
    };

    return {
      page:  page,
    }
  })();

  return {
    contructor: constructor,
    init:       init,
    pages:      pages,
    components: components,
    modules:    modules,
    services:   services,
    cache:      cache
  }
})(jQuery, document, window);

/**
 * Events
 */
app.modules.events = app.modules.events || {};

app.modules.events = (function ($, doc, win, undefined) {
  var evs = {};

  function on(eventName, fn) {
    evs[eventName] = evs[eventName] || [];
    evs[eventName].push(fn);
  }

  function off(eventName, fn) {
    if (evs[eventName]) {
      var i = 0,
        length = evs[eventName].length;

      for (i; i < length; i++) {
        if (evs[eventName][i] === fn) {
          evs[eventName].splice(i, 1);
          break;
        }
      }
    }
  }

  function emit(eventName, data) {
    if (evs[eventName]) {
      evs[eventName].forEach(function (fn) {
        fn(data);
      });
    }
  }

  return {
    on: on,
    off: off,
    emit: emit
  };
})(jQuery, document, window);

/**
 * Services
 */
app.services.api = app.services.api || {};

app.services.api = (function ($) {
  var url = 'http://127.0.0.1:3000/api/',

  get = function (srv) {
    return $.ajax({
      url: url + srv,
      method: 'GET'
    });
  },

  getById = function (srv, id) {
    id = (id ? id : null);

    return $.ajax({
      url: url + srv + '/' + id,
      method: 'POST'
    });
  },

  post = function (srv, data) {
    data = (data ? data : null);

    return $.ajax({
      url: url + srv,
      method: 'POST',
      data: data
    });
  },

  del = function name(srv, id) {
    return $.ajax({
      url: url + srv + '/' + id,
      method: 'DELETE'
    });
  };

  return {
    get: get,
    getById: getById,
    post: post,
    del: del
  };
})(jQuery);