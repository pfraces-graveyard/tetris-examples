var arrayize = module.exports = function (obj) {
  if (typeof obj === 'undefined') {
    return [];
  }
  return obj.length ? Array.prototype.slice.call(obj) : [].concat(obj);
};
