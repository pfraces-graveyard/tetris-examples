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
