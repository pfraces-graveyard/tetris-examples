var arrayize = require('arrayize'),
    dictionary = require('dictionary');

var extend = module.exports = function () {
  var args = arrayize(arguments),
      parent = args.shift() || {},
      mixin,
      Constructor = function () {};

  Constructor.prototype = parent;

  while (mixin = args.shift()) {
    dictionary(mixin).each(function (value, key) {
      Constructor.prototype[key] = value;
    });
  };

  return new Constructor();
};
