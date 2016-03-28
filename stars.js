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
  MIN_SIZE: 1,
  MAX_SIZE: 3,
  refill: function(putNewStarsAtTop) {
    var pInst = this.pInst;

    while (this.stars.length < this.number) {
      this.stars.push({
        x: pInst.random(0, pInst.width),
        y: putNewStarsAtTop ? 0 : pInst.random(0, pInst.height),
        color: pInst.random(this.MIN_INTENSITY, this.MAX_INTENSITY),
        size: pInst.random(this.MIN_SIZE, this.MAX_SIZE),
        velocity: pInst.random(this.MIN_VELOCITY, this.MAX_VELOCITY)
      });
    }
  },
  draw: function() {
    var pInst = this.pInst;

    pInst.push();
    pInst.noStroke();
    this.stars.forEach(function(star) {
      pInst.fill(star.color);
      pInst.rect(star.x, star.y, star.size, star.size);
      star.y += star.velocity;
    });
    pInst.pop();

    this.stars = this.stars.filter(function(star) {
      return star.y < pInst.height;
    });
    this.refill(true);
  }
};
