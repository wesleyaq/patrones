/* ===========
 * Proyecto: Módulos People
 * Fecha Inicio: 10/04/2018
 * Email Desarrollador: wesleyaltamiranda@gmail.com
 * ======== */

'use strict';
var events = events || {};

events = (function ($, doc, win, undefined) {
  var evs = {};

  function on(eventName, fn) {
    evs[eventName] = evs[eventName] || [];
    evs[eventName].push(fn);
  }

  function off(eventName, fn) {
    if (evs[eventName]) {
      var i = 0,
      length = evs[eventName].length;

      for(i; i < length; i++) {
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

var server = server || {};

server = (function($) {
  var url = 'http://127.0.0.1:3000/api/',

  get = function(srv) {
    return $.ajax({
      url: url + srv,
      method: 'GET'
    });
  },

  getById = function(srv, id) {
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

var stats = stats || {};

stats = (function($, doc, win, undefined) {
  var persons = 0,

  //Cache DOM
  $el = $('#startsModule'),
  tmpl = $el.find('#stats-tmpl').html(),

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
    events.off('peopleChanged', _setPeople);
  }

  //Bind events
  events.on('peopleChanged', _setPeople);
  _render();

  return {
    destroy: destroy
  }
})(jQuery, document, window);

var people = people || {};

people = (function($, doc, win, undefined) {
  var persons = 'peoples', //['Will', 'Steve'],
  $el     = $('#peopleModule'),
  $btn    = $el.find('button'),
  $input  = $el.find('input'),
  $ul     = $el.find('[data-js="people"]'),
  tmpl    = $el.find('#people-tmpl').html(),

  get = function () {
    return server.get(persons);
  },

  save = function(data) {
    return server.post(persons, data);
  },

  remove = function(id) {
    return server.del(persons, id);
  },

  addPerson = function(value) {
    var name = ((typeof value === "string")? value: $input.val());

    if(name) {
      save({ name: name })
      .done(function(resp) {
        if (resp && resp.status == 'Ok') {
          _render();
          $input.val('');
        }
      });
    }
  },

  delPerson = function(e) { 
    var id = (typeof e === 'number'? e: $(e.target).attr('data-id'));

    if(id) {
      remove(id)
      .done(function (resp) {
        if (resp && resp.status == 'Ok') {
          _render();
        }
      });
    }
  },

  _inputKeypress = function(e) {
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;

    if (keyCode == '13') {
      addPerson();
    }
  },

  _render = function () {
    if (tmpl) {
      get().done(function (resp) {
        if (resp && resp.status == 'Ok') {
          $ul.html(Mustache.render(tmpl, { people: (resp && resp.data ? resp.data : null) }));
          events.emit('peopleChanged', (resp && resp.data ? resp.data.length : 0));
        }
      });
    }
  };

  _render();

  //Bind events
  $btn.on('click', addPerson);
  $input.on('keypress', _inputKeypress);
  $ul.delegate('[data-js="del"]', 'click', delPerson);

  return {
    addPerson: addPerson,
    delPerson: delPerson
  }
})(jQuery, document, window);