function Timer(pInst) {
  pInst = pInst || window;

  var self = this;
  var timers = [];

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
}
