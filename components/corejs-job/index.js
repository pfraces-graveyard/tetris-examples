var job = module.exports = function (fn) {
  try {
    return fn();
  } catch (e) {
    if (e instanceof JobDone) {
      return e.res;
    }
    throw e;
  }
};

var JobDone = function (res) {
  this.res = res;
};

job.done = function (res) {
  throw new JobDone(res);
};
