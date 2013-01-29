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
