var dictionary = module.exports = function (terms) {
  return new Dictionary(terms);
};

var Dictionary = function (terms) {
  this.terms = terms || {};
};

Dictionary.prototype.set = function (key, value) {
  this.terms[key] = value;
  return this;
};

Dictionary.prototype.get = function (key) {
  return this.terms[key];
};

Dictionary.prototype.del = function (key) {
  delete this.terms[key];
  return this;
};

Dictionary.prototype.has = function (key) {
  return has(this.terms, key);
};

Dictionary.prototype.each = function (fn) {
  return each(this.terms, fn);
};

Dictionary.prototype.keys = function () {
  var keys = [];
  each(this.terms, function (value, key) {
    keys.push(key);
  });
  return keys;
};

var has = function (obj, prop) {
  return Object.prototype.propertyIsEnumerable.call(obj, prop);
};
  
var each = function (obj, fn) {
  for (var prop in obj) {
    if (has(obj, prop)) {
      fn(obj[prop], prop);
    }
  }
};
