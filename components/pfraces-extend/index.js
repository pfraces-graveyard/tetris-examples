var extend = module.exports = function (obj) {
  var Constructor = function () {};
  Constructor.prototype = obj;
  return new Constructor();
};
