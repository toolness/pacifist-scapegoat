function Enemy(x, y, radius, color, timer, pInst) {
  pInst = pInst || window;

  this.pInst = pInst;
  this.radius = radius;
  this.sprite = pInst.createSprite(x, y);
  this.sprite.shapeColor = pInst.color(color);
  this.sprite.depth = 0;
  this.sprite.draw = this.draw.bind(this);
  this.sprite.setCollider('circle', 0, 0, radius);
  this.timer = timer.createChild();
  this.timer.wait(this.MAX_LIFETIME).then(this.destroy.bind(this));
}

Enemy.prototype = {
  MAX_LIFETIME: 60 * 30,
  draw: function() {
    var pInst = this.pInst;

    pInst.noStroke();
    pInst.fill(this.sprite.shapeColor);
    pInst.ellipse(0, 0, this.radius * 2, this.radius * 2);
  },
  add: function(promise) {
    return promise.catch(function(e) {
      if (e instanceof TimerDestroyedError) {
        // This just happened because we were destroyed, so ignore the
        // exception.
      } else {
        throw e;
      }
    });
  },
  destroy: function() {
    if (!this.sprite.removed) this.sprite.remove();
    this.timer.destroy();
  }
};
