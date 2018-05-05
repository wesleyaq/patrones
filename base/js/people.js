/**
 * Component Stats
 */
app.components.stats = app.components.stats || {};

app.components.stats = (function ($, doc, win, undefined) {
  var persons = 0,

  //Cache DOM
  $el  = $.js('startsModule'),
  tmpl = $el.find(js('statsTmpl')).html(),

  init = function () {
    //Bind events
    app.modules.events.on('peopleChanged', _setPeople);
    _render();
  },

  _render = function () {
    if (tmpl) {
      $el.html(Mustache.render(tmpl, {
        people: persons
      }));
    }
  },

  _setPeople = function (newPerson) {
    persons = newPerson;
    _render();
  },

  destroy = function () {
    $stats.remove();
    app.modules.events.off('peopleChanged', _setPeople);
  };

  return {
    init: init,
    destroy: destroy
  }
})(jQuery, document, window);

/**
 * Component People
 */
app.components.people = app.components.people || {};

app.components.people = (function ($, doc, win, undefined) {
  var persons = 'peoples',
  $el         = $.js('peopleModule'),
  $btn        = $el.find(js('personAdd')),
  $input      = $el.find(js('personName')),
  $ul         = $el.find(js('people')),
  tmpl        = $el.find(js('peopleTmpl')).html(),

  init = function () {
    _render();

    //Bind events
    $btn.on('click', add);
    $input.on('keypress', _inputKeypress);
    $ul.delegate(js('del'), 'click', del);
  },

  _get = function () {
    return app.services.api.get(persons);
  },

  _save = function (data) {
    return app.services.api.post(persons, data);
  },

  _remove = function (id) {
    return app.services.api.del(persons, id);
  },

  add = function (value) {
    var name = ((typeof value === "string") ? value : $input.val());

    if (name) {
      _save({
          name: name
        })
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
          $ul.html(Mustache.render(tmpl, {
            people: (resp && resp.data? resp.data : null)
          }));
          app.modules.events.emit('peopleChanged', (resp && resp.data? resp.data.length: 0));
        }
      });
    }
  };

  return {
    init: init,
    add: add,
    del: del
  }
})(jQuery, document, window);

/**
 * Init Pages
 */

(function ($, doc, win, undefined) {
  app.pages.common = new app.contructor.page('common');
  app.pages.common.DOMReady = function () {
    console.log('DOMReady Common');
  };
})(jQuery, document, window);

(function ($, doc, win, undefined) {
  app.pages.home = new app.contructor.page('people');
  app.pages.home.DOMReady = function () {
    console.log('DOMReady Página People');

    app.components.people.init();
    app.components.stats.init();
  };
})(jQuery, document, window);

app.init();