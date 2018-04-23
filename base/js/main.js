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
  _pages      = function() {},
  _components = function() {},
  _modules    = function() {},
  _services   = function() {},
  _cache      = function() {},

  _init = function() {
    app.pages.common.init();

    $.each(app.pages, function () {
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
 * Services People
 */
app.services.people = app.services.people || {};

app.services.people = (function ($) {
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

/**
 * Component Stats
 */
app.components.stats = app.components.stats || {};

app.components.stats = (function ($, doc, win, undefined) {
  var persons = 0,

  //Cache DOM
  $el  = $.js('startsModule'),
  tmpl = $el.find(js('statsTmpl')).html(),

  init = function() {
    //Bind events
    app.modules.events.on('peopleChanged', _setPeople);
    _render();
  },

  _render = function () {
    if (tmpl) {
      $el.html(Mustache.render(tmpl, { people: persons }));
    }
  },

  _setPeople = function (newPerson) {
    persons = newPerson;
    _render();
  },

  destroy = function () {
    $stats.remove();
    app.modules.events.off('peopleChanged', _setPeople);
  }

  return {
    init:    init,
    destroy: destroy
  }
})(jQuery, document, window);

/**
 * Component People
 */
app.components.people = app.components.people || {};

app.components.people = (function ($, doc, win, undefined) {
  var persons = 'peoples',
  $el    = $.js('peopleModule'),
  $btn   = $el.find(js('personAdd')),
  $input = $el.find(js('personName')),
  $ul    = $el.find(js('people')),
  tmpl   = $el.find(js('peopleTmpl')).html(),

  init = function() {
    _render();

    //Bind events
    $btn.on('click', add);
    $input.on('keypress', _inputKeypress);
    $ul.delegate(js('del'), 'click', del);
  },

  _get = function () {
    return app.services.people.get(persons);
  },

  _save = function (data) {
    return  app.services.people.post(persons, data);
  },

  _remove = function (id) {
    return  app.services.people.del(persons, id);
  },

  add = function (value) {
    var name = ((typeof value === "string") ? value : $input.val());

    if (name) {
      _save({ name: name })
        .done(function (resp) {
          if (resp && resp.status == 'Ok') {
            _render();
            $input.val('');
          }
        });
    }
  },

  del = function (e) {
    var id = (typeof e === 'number' ? e : $(e.target).attr('data-id'));

    if (id) {
      _remove(id)
        .done(function (resp) {
          if (resp && resp.status == 'Ok') {
            _render();
          }
        });
    }
  },

  _inputKeypress = function (e) {
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;

    if (keyCode == '13') {
      add();
    }
  },

  _render = function () {
    if (tmpl) {
      _get().done(function (resp) {
        if (resp && resp.status == 'Ok') {
          $ul.html(Mustache.render(tmpl, { people: (resp && resp.data ? resp.data : null) }));
          app.modules.events.emit('peopleChanged', (resp && resp.data ? resp.data.length : 0));
        }
      });
    }
  };

  return {
    init: init,
    add:  add,
    del:  del
  }
})(jQuery, document, window);

/**
 * Init Pages
 */
(function($, doc, win, undefined) {
  app.pages.common = new app.contructor.page('common');
  app.pages.common.DOMReady = function() {
    console.log('DOMReady Common');
  };
})(jQuery, document, window);

(function($, doc, win, undefined) {
  app.pages.home = new app.contructor.page('people');
  app.pages.home.DOMReady = function() {
    console.log('DOMReady Página People');

    app.components.people.init();
    app.components.stats.init();
  };
})(jQuery, document, window);

app.init();