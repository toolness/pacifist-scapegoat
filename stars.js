function Stars(number, pInst) {
  this.pInst = pInst || window;
  this.number = number;
  this.stars = [];
  this.refill();
}

Stars.prototype = {
  MIN_INTENSITY: 100,
  MAX_INTENSITY: 200,
  MIN_VELOCITY: 0.1,
  MAX_VELOCITY: 2.0,
  refill: function(putNewStarsAtTop) {
    var pInst = this.pInst;

    while (this.stars.length < this.number) {
      this.stars.push({
        x: pInst.random(0, pInst.width),
        y: putNewStarsAtTop ? 0 : pInst.random(0, pInst.height),
        color: pInst.random(this.MIN_INTENSITY, this.MAX_INTENSITY),
        velocity: pInst.random(this.MIN_VELOCITY, this.MAX_VELOCITY)
      });
    }
  },
  draw: function() {
    var pInst = this.pInst;

    pInst.loadPixels();
    this.stars.forEach(function(star) {
      set(star.x, star.y, color(star.color));
      star.y += star.velocity;
    });
    this.stars = this.stars.filter(function(star) {
      return star.y < pInst.height;
    });
    this.refill(true);
    pInst.updatePixels();
  }
};
