module.exports = function (generate) {
  var uid = 0;

  return function () {
    var id = uid;
    uid++;
    return generate ? generate(id) : id;
  };
};
