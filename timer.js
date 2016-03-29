function Timer(pInst) {
  pInst = pInst || window;

  var self = this;
  var timers = [];
  var range = function(count) {
    var array = [];

    for (var i = 0; i < count; i++) {
      array.push(i);
    }

    return array;
  };

  self.update = function() {
    var oldTimers = timers;

    timers = [];

    oldTimers.forEach(function(timer) {
      if (pInst.frameCount >= timer.endFrame) {
        timer.resolve();
      } else {
        timers.push(timer);
      }
    });
  };

  self.wait = function(frames) {
    return new Promise(function(resolve) {
      timers.push({endFrame: pInst.frameCount + frames, resolve: resolve});
    });
  };

  self.interval = function(frames, cb) {
    return new Promise(function(resolve, reject) {
      function waitAndCall() {
        return self.wait(frames).then(cb).then(waitAndCall);
      }

      return waitAndCall().catch(reject);
    });
  };

  self.finiteInterval = function(frames, count, cb) {
    var promise = Promise.resolve();

    range(count).forEach(function(i) {
      promise = promise.then(function() {
        return cb(i);
      }).then(function() {
        return self.wait(frames);
      });
    });

    return promise;
  };
}
