var arrayize = require('arrayize'),
    extend = require('extend'),
    dictionary = require('dictionary');

var sel = module.exports = function (selector) {
  return new Sel(selector);
};

var Sel = function (selector) {
  this.nodes = arrayize(select(parse(selector)));
};

Sel.prototype.first = function () {
  return this.nodes[0];
};

Sel.prototype.last = function () {
  return this.nodes[this.nodes.length - 1];
};

sel.plugin = function () {
  arrayize(arguments).forEach(function (plugin) {
    dictionary(plugin).each(function (fn, name) {
      Sel.prototype[name] = function (args) {
        this.nodes.forEach(function (node) {
          fn(extend(args, { node: node, sel: sel }));
        });
        return this;
      };
    });
  });
  return this;
};

sel.div = function (id) {
  var s = sel(),
      d = document.createElement('div');

  d.id = id;
  s.nodes = [d];
  return s;
};

var parse = function (selector) {
  var type, 
      val;
  
  if (/^[#][\w]+$/.test(selector)) {
    type = 'id';
    val = selector.slice(1);
  } else if (/^[.][\w]+$/.test(selector)) {
    type = 'class';
    val = selector.slice(1);
  } else if (/^[\w]+$/.test(selector)) {
    type = 'tag';
    val = selector;
  }

  return {
    type: type,
    val: val
  };
};

var select = function (selector) {
  var type = selector.type,
      val = selector.val,
      selection;

  if (type === 'id') {
    selection = document.getElementById(val);
  } else if (type === 'class') {
    selection = document.getElementsByClassName(val);
  } else if (type === 'tag') {
    selection = document.getElementsByTagName(val);
  }

  return selection;
};
