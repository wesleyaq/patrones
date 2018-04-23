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

var server = events || {};

server = (function($) {
  var url = 'http://127.0.0.1:3000/api/';

  get = function(srv, data) {
    data = (data ? data : null);

    return $.ajax({
      url: url + srv,
      method: "GET",
      data: data
    });
  };

  return {
    get: get
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
  var persons = 'persons'; //['Will', 'Steve'],
  $el     = $('#peopleModule'),
  $btn    = $el.find('button'),
  $input  = $el.find('input'),
  $ul     = $el.find('#people'),
  tmpl    = $el.find('#people-tmpl').html(),

  _render = function() {
    if(tmpl) {
      getPersons()
      .done(function (resp) {
        if(data && data.status == 'Ok') {
          $ul.html(Mustache.render(tmpl, { people: (resp && resp.data? resp.data: null) }));
          // stats.setPeople(persons.length);
          events.emit('peopleChanged', (resp && resp.data? resp.data.length: 0);
        }
      });
    }
  },

  getPersons = function() {
    return server.get(persons);
  },

  addPerson = function(value) {
    var name = ((typeof value === "string")? value: $input.val());

    if(name) {
      persons.push(name);
      _render();
      $input.val('');
    }
  },

  delPerson = function(event) {
    var i;

    if(typeof event === 'number') {
      i = event;

    } else {
      var $remove = $(event.target).closest('li');
      i = $remove.index();
      // i = $ul.find('li').index($remove);
    }
    persons.splice(i, 1);
    _render();
  },

  _inputKeypress = function(e) {
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;

    if (keyCode == '13') {
      addPerson();
    }
  };

  _render();

  //Bind events
  $btn.on('click', addPerson);
  $input.on('keypress', _inputKeypress);
  $ul.delegate('i.del', 'click', delPerson);

  return {
    addPerson: addPerson,
    delPerson: delPerson
  }
})(jQuery, document, window);