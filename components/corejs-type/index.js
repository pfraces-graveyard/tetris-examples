var type = module.exports = function (obj) {
  return new Type(obj);
};

var Type = function (obj) {
  this.obj = obj;
};

Type.prototype.isUndefined = function () {
  return typeof this.obj === 'undefined';
};

Type.prototype.isString = function () {
  return this.obj instanceof String;
};

Type.prototype.isNumber = function () {
  return this.obj instanceof Number;
};

Type.prototype.isBoolean = function () {
  return this.obj instanceof Boolean;
};

Type.prototype.isArray = function () {
  return this.obj instanceof Array;
};

Type.prototype.isFunction = function () {
  return typeof this.obj === 'function';
};
