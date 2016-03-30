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

  self.destroyed = false;

  self.update = function() {
    var oldTimers = timers;

    timers = [];

    oldTimers.forEach(function(timer) {
      if (timer instanceof Timer) {
        if (!timer.destroyed) {
          timer.update();
          timers.push(timer);
        }
      } else if (pInst.frameCount >= timer.endFrame) {
        timer.resolve();
      } else {
        timers.push(timer);
      }
    });
  };

  self.createChild = function() {
    var child = new Timer(pInst);

    timers.push(child);

    return child;
  };

  self.destroy = function() {
    var oldTimers = timers;

    if (self.destroyed) return;
    timers = [];

    oldTimers.forEach(function(timer) {
      if (timer instanceof Timer) {
        timer.destroy();
      } else {
        timer.reject(new TimerDestroyedError());
      }
    });

    self.destroyed = true;
  };

  self.wait = function(frames) {
    return new Promise(function(resolve, reject) {
      timers.push({
        endFrame: pInst.frameCount + frames,
        resolve: resolve,
        reject: reject
      });
    });
  };

  self.interval = function(frames, cb) {
    return new Promise(function(resolve, reject) {
      function waitAndCall() {
        return self.wait(frames).then(cb).then(function(cbResult) {
          if (cbResult === Timer.STOP_INTERVAL) return resolve();
          return waitAndCall();
        });
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

function TimerDestroyedError() {
  Error.apply(this, arguments);
}

TimerDestroyedError.prototype = Object.create(Error.prototype);

Timer.STOP_INTERVAL = typeof(Symbol) === 'function' ? Symbol()
                                                    : new Object();
