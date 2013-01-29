

/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    if ('.' != path.charAt(0)) {
      var segs = parent.split('/');
      var i = lastIndexOf(segs, 'deps') + 1;
      if (!i) i = 0;
      path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
      return path;
    }
    return require.normalize(p, path);
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};
require.register("pfraces-jsl/index.js", function(exports, require, module){
var jsl = module.exports = function (obj) {
  return new Jsl(obj);
};

var Jsl = function (obj) {
  this.obj = obj;
};

Jsl.prototype.isString = function () {
  return typeof this.obj === 'string' || this.obj instanceof String;
}

Jsl.prototype.isNumber = function () {
  return typeof this.obj === 'number' || this.obj instanceof Number;
}

Jsl.prototype.isBoolean = function () {
  return typeof this.obj === 'boolean' || this.obj instanceof Boolean;
}

Jsl.prototype.isScalar = function () {
  return this.isString() || this.isNumber() || this.isBoolean();
}

Jsl.prototype.isArray = function () {
  return this.obj instanceof Array;
}

Jsl.prototype.isFunction = function () {
  return typeof this.obj === 'function';
}

Jsl.prototype.toArray = function () {
  if (this.isArray()) return this.obj;
  if (this.isFunction()) return jsl(this.obj()).toArray();
  if (this.isScalar() || !this.obj.length) return [].concat(this.obj);
  return Array.prototype.slice.call(this.obj);
}

Jsl.prototype.traverse = function (opts) {
  var filtered = opts.filter ? this.obj[opts.filter] : this.obj;

  if (!filtered) return;
  if (opts.before) opts.before(this.obj);
  
  jsl(filtered).toArray().forEach(function (node) {
    if (opts.each) opts.each(node);
    jsl(node).traverse(opts);
  });

  if (opts.after) opts.after(this.obj);
}

});
require.register("pfraces-dal/index.js", function(exports, require, module){
var jsl = require('jsl');

var dal = module.exports = function (el) {
  return new Dal(el);
};

var Dal = function (el) {
  if (!el) {
    this.DOM = document.createElement('div');
  } else if (jsl(el).isString()) {
    this.DOM = document.getElementById(el) || (function () {
      var div = dal();
      div.DOM.id = el;
      return div.attach().DOM;
    })();
  } else {
    this.DOM = el; 
  }

  this.orig = !this.DOM.style ? {} : {
    display: this.DOM.style.display,
    overflow: this.DOM.style.overflow,
    position: this.DOM.style.position
  };
};

Dal.prototype.getHtml = function () {
  return this.DOM.innerHTML;
};

Dal.prototype.toHtml = function () {
  return dal().add(this).DOM.innerHTML;
};

Dal.prototype.getChildren = function () {
  return jsl(this.DOM.childNodes).
    toArray().
    map(function (el) {
      return dal(el);
    });
};

Dal.prototype.getColor = function () {
  return {
    bg: this.DOM.style.background,
    fg: this.DOM.style.color
  };
};

Dal.prototype.isSame = function (target) {
  if (target.DOM) target = target.DOM;
  return this.DOM === target;
};

Dal.prototype.isUnder = function (target) {
  var parent = this.DOM.parentNode;
  if (target.DOM) target = target.DOM;
  while (parent) {
    if (parent === target) return true;
    parent = parent.parentNode;
  }
  return false;
};

Dal.prototype.isFull = function () {
  this.DOM.style.overflow = 'hidden';
  var isOverflowing = (this.DOM.clientWidth + 1) < this.DOM.scrollWidth ||
                      (this.DOM.clientHeight + 1) < this.DOM.scrollHeight;
  this.DOM.style.overflow = this.orig.overflow;
  return isOverflowing;
};

Dal.prototype.isEmpty = function () {
  return !this.DOM.firstChild;
};

Dal.prototype.isTag = function (tagName) {
  if (this.DOM.tagName) {
    return this.DOM.tagName === tagName.toUpperCase();
  }
  return false;
};

Dal.prototype.hasClass = function (className) {
  return this.DOM.classList ? this.DOM.classList.contains(className) : false;
};

Dal.prototype.attach = function () {
  if (!this.isUnder(document.body)) document.body.appendChild(this.DOM);
  return this;
};

Dal.prototype.detach = function () {
  if (this.DOM.parentNode) this.DOM.parentNode.removeChild(this.DOM);
  return this;
};

Dal.prototype.add = function (newEl, content) {
  var el = {};
  if (jsl(newEl).isString()) el = document.createElement(newEl);
  else if (newEl.DOM) el = newEl.DOM;
  else el = newEl;
  if (content) el.appendChild(document.createTextNode(content));
  this.DOM.appendChild(el);
  return this;
};

Dal.prototype.clear = function () {
  while (!this.isEmpty()) this.DOM.removeChild(this.DOM.firstChild);
  return this;
};

Dal.prototype.copy = function () {
  return dal(this.DOM.cloneNode(false));
};

Dal.prototype.clone = function () {
  return dal(this.DOM.cloneNode(true));
};

Dal.prototype.parent = function () {
  return dal(this.DOM.parentNode);
};

Dal.prototype.first = function () {
  return dal(this.DOM.firstChild);
};

Dal.prototype.last = function () {
  return dal(this.DOM.lastChild);
};

Dal.prototype.lastLeaf = function () {
  var lastChild = this.DOM.lastChild;
  if (!lastChild) return this;

  while(lastChild) {
    if (!lastChild.lastChild) return dal(lastChild);
    lastChild = lastChild.lastChild
  }
};

Dal.prototype.traverse = function (opts) {
  jsl(this.DOM).traverse({
    filter: 'childNodes',
    before: !opts.before ? opts.before : function (node) {
      opts.before(dal(node));
    },
    each: !opts.each ? opts.each : function (node) {
      opts.each(dal(node));
    },
    after: !opts.after ? opts.after : function (node) {
      opts.after(dal(node));
    }
  });
};

Dal.prototype.path = function (target) {
  var path = this.copy()
    , parent = this.DOM.parentNode;
  if (target.DOM) target = target.DOM;
  if (this.isSame(target)) return this.copy();
  while (parent) {
    path = dal(parent).copy().add(path);
    if (parent === target) return path;
    parent = parent.parentNode;
  }
};

Dal.prototype.show = function () {
  this.DOM.style.position = this.orig.position;
  this.DOM.style.visibility = 'visible';
  return this;
};

Dal.prototype.hide = function () {
  this.DOM.style.position = 'absolute';
  this.DOM.style.visibility = 'hidden';
  return this;
};

Dal.prototype.clean = function () {
  this.DOM.style.visibility = 'hidden';
  return this;
};

Dal.prototype.move = function (opts) {
  this.DOM.style.position = 'absolute';
  this.DOM.style.left = opts.x; 
  this.DOM.style.top = opts.y;
  if (opts.relative) {
    this.parent().DOM.style.position = 'relative';
  }
  return this;
};

Dal.prototype.on = function () {
  this.DOM.addEventListener.apply(this.DOM, jsl(arguments).toArray());
  return this;
};

Dal.prototype.color = function (opts) {
  if (typeof opts.bg !== 'undefined') {
    this.DOM.style.background = opts.bg;
  }
  if (typeof opts.fg === 'undefined') {
    this.DOM.style.color = opts.fg;
  }
  if (typeof opts.opacity === 'undefined') {
    this.DOM.style.opacity = opts.opacity;
  }
  return this;
};

Dal.prototype.size = function (opts) {
  this.DOM.style.width = opts.width;
  this.DOM.style.height = opts.height;
  return this;
};

Dal.prototype.collapse  = function () {
  this.DOM.style.border = '';
  this.DOM.style.margin = '';
  this.DOM.style.padding = '';
  return this;
};

Dal.prototype.uncollapse = function () {
  var padding = this.DOM.style.padding;
  if (!padding || padding === '0') this.DOM.style.padding = '1px';
  return this;
};

Dal.prototype.class = {
  add: function (className) {
    this.DOM.className += ' ' + className;
    return this;
  }
  , del: function (className) {
    this.DOM.className = this.DOM.className
      .replace(new RegExp('\\b' + className + '\\b'));
  }
};

Dal.prototype.html = function (html) {
  this.DOM.innerHTML = html;
  return this;
};

});
require.register("pfraces-extend/index.js", function(exports, require, module){
var extend = module.exports = function (obj) {
  var Constructor = function () {};
  Constructor.prototype = obj;
  return new Constructor();
};

});
require.register("pfraces-matrix/index.js", function(exports, require, module){
var extend = require("extend");

var matrix = module.exports = function (config) {
  return new Matrix(config);
};

var private = {
  width: 0,
  height: 0,
  matrix: []
};

var Matrix = function (config) {
  private.width = config.width;
  private.height = config.height;

  /**
   * TODO
   * 
   * *   de momento creo una matriz nueva, pero el resize debe
   *     actualizar la matriz existente
   */
  var m = [];
  for (var y = 0; y < private.height; y++) (function () {
    var row = [];
    for (var x = 0; x < private.width; x++) {
      row.push(extend(config.cell));
    }
    m.push(row);
  })();
  private.matrix = m;
};

Matrix.prototype.at = function (args) {
  return private.matrix[args.y][args.x];
};

});
require.register("pfraces-gen/index.js", function(exports, require, module){
var jsl = require("jsl"),
    dal = require("dal"),
    matrix = require("matrix");

var gen = module.exports = function (config) {
  return new Gen(config);
};

var private = {
  self: {},
  board: {},
  cell: {},
  bg: 'lightblue'
};

var Gen = function (config) {
  this.board = config.board;
  this.canvas = dal(this.board.id);
  this.map = matrix(this.board);
  this.keymap = config.keymap;

  private.self = this;
  private.board = config.board;
  private.cell = config.cell;

  dal(document.body).on('keypress', function (event) {
    var key = String.fromCharCode(event.keyCode);
    if (key in private.self.keymap) {
      private.self.keymap[key]();
    }
  });
};

Gen.prototype.draw = {
  board: function () {
    var board = private.board,
        cell = private.cell;
    private.self.canvas.size({
      width: (board.width * cell.width).toString() + cell.unit,
      height: (board.height * cell.height).toString() + cell.unit
    }).
      color({ bg: private.bg });

    for (var y = 0; y < board.height; y++) {
      for (var x = 0; x < board.width; x++) {
        this.cell({ x: x, y: y });
      };
    };
  },
  cell: function (args) {
    var cell = dal('cell_' + args.x + '_' + args.y)
      .size({
        width: private.cell.width.toString() + private.cell.unit,
        height: private.cell.height.toString() + private.cell.unit
      });

    /**
     * dal:
     *
     * Sustituir
     *
     *   dal('board').add(cell);
     *
     * por:
     *
     *   cell.goto('board'); 
     *
     * Si ya está dentro de 'board' no se mueve
     *
     * add() debería clonar, si el nodo a añadir forma parte de document
     */
    dal('board').add(cell);
    cell
      .color({ bg: private.self.map.at(args).color })
      .move({
        x: (args.x * private.cell.width).toString() + private.cell.unit,
        y: (args.y * private.cell.height).toString() + private.cell.unit,
        relative: true
      })
  }
};

});
require.register("pfraces-tetris/index.js", function(exports, require, module){
var gen = require('gen'),
    engine;

var tetris = module.exports = function (config) {
  return new Tetris(config);
};

var private = {
  cursor: { x: 0, y: 0 }
};

var Tetris = function (config) {
  engine = gen(config);
};

Tetris.prototype.start = function () {
  engine.draw.board();
  engine.map.at(private.cursor).color = 'blue';
  engine.draw.cell(private.cursor);
};

Tetris.prototype.keymap = function (keymap) {
  engine.keymap = keymap;
};

Tetris.prototype.up = function () {
  /* player.move.up(); // teleport
     player.go.up(); // path finding */
  if (private.cursor.y === 0) return;
  engine.map.at(private.cursor).color = engine.board.cell.color;
  engine.draw.cell(private.cursor);
  private.cursor.y--;
  engine.map.at(private.cursor).color = 'blue';
  engine.draw.cell(private.cursor);
};

Tetris.prototype.down = function () {
  if (private.cursor.y === (engine.board.height - 1)) return;
  engine.map.at(private.cursor).color = engine.board.cell.color;
  engine.draw.cell(private.cursor);
  private.cursor.y++;
  engine.map.at(private.cursor).color = 'blue';
  engine.draw.cell(private.cursor);
};

Tetris.prototype.left = function () {
  if (private.cursor.x === 0) return;
  engine.map.at(private.cursor).color = engine.board.cell.color;
  engine.draw.cell(private.cursor);
  private.cursor.x--;
  engine.map.at(private.cursor).color = 'blue';
  engine.draw.cell(private.cursor);
};

Tetris.prototype.right = function () {
  if (private.cursor.x === (engine.board.width - 1)) return;
  engine.map.at(private.cursor).color = engine.board.cell.color;
  engine.draw.cell(private.cursor);
  private.cursor.x++;
  engine.map.at(private.cursor).color = 'blue';
  engine.draw.cell(private.cursor);
};

});
require.register("tetris-examples/index.js", function(exports, require, module){
var tetris = require('tetris')({
  board: {
    id: 'board',
    width: 10,
    height: 17,
    cell: { color: '' }
  },
  cell: {
    width: 3,
    height: 3,
    unit: 'em'
  }
});

tetris.keymap({
  '8': tetris.up,
  '5': tetris.down,
  '4': tetris.left,
  '6': tetris.right
});

tetris.start();

});
require.alias("pfraces-tetris/index.js", "tetris-examples/deps/tetris/index.js");
require.alias("pfraces-gen/index.js", "pfraces-tetris/deps/gen/index.js");
require.alias("pfraces-jsl/index.js", "pfraces-gen/deps/jsl/index.js");

require.alias("pfraces-dal/index.js", "pfraces-gen/deps/dal/index.js");
require.alias("pfraces-jsl/index.js", "pfraces-dal/deps/jsl/index.js");

require.alias("pfraces-matrix/index.js", "pfraces-gen/deps/matrix/index.js");
require.alias("pfraces-extend/index.js", "pfraces-matrix/deps/extend/index.js");

