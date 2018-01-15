function Player(timer, pInst) {
  pInst = pInst || window;
  this.pInst = pInst;
  this.timer = timer;
  this.explosionRadius = 0;
  this.explosionOpacity = 255;
  this.sprite = pInst.createSprite(
    pInst.width / 2,
    pInst.height * 0.95,
    this.HITBOX_SIZE, this.HITBOX_SIZE
  );
  this.sprite.depth = 10;
  this.sprite.draw = this.draw.bind(this);
}

Player.prototype = {
  HITBOX_SIZE: 20,
  DISPLAY_SIZE_COEFF: 2,
  DIVOT_SIZE_COEFF: 0.8,
  SPEED: 4,
  EXPLODE_GROW_FRAMES: 30,
  EXPLODE_FADE_FRAMES: 15,
  explode: function() {
    var self = this;
    var pInst = self.pInst;
    var timer = self.timer;
    var maxRadius = Math.max(pInst.width, pInst.height) * 2;
    var radiusIncrement = maxRadius / self.EXPLODE_GROW_FRAMES;
    var opacityDecrement = 255 / self.EXPLODE_FADE_FRAMES;

    self.sprite.setSpeed(0, 0);

    return timer.finiteInterval(1, self.EXPLODE_GROW_FRAMES, function() {
      self.explosionRadius += radiusIncrement;
    }).then(function() {
      return timer.finiteInterval(1, self.EXPLODE_FADE_FRAMES, function() {
        self.explosionOpacity -= opacityDecrement;
      });
    }).then(function() {
      self.sprite.remove();
    });
  },
  processInput: function({ left, right, up, down }) {
    var speed = this.SPEED;
    var angle = 0;

    if (this.explosionRadius) return;

    if (left && up) {
      angle = -135;
    } else if (right && up) {
      angle = -45;
    } else if (left && down) {
      angle = 135;
    } else if (right && down) {
      angle = 45;
    } else if (left) {
      angle = 180;
    } else if (right) {
      angle = 0;
    } else if (up) {
      angle = -90;
    } else if (down) {
      angle = 90;
    } else {
      speed = 0;
    }

    this.sprite.setSpeed(speed, angle);
  },
  draw: function() {
    var pInst = this.pInst;
    var halfSize = (this.sprite.width / 2) * this.DISPLAY_SIZE_COEFF;

    pInst.noStroke();
    pInst.fill(pInst.color(255, 255, 255, this.explosionOpacity));

    if (this.explosionOpacity === 255) {
      // Have the triangles overlap a bit along the y-axis to ensure that
      // they don't appear to be separated at all.
      pInst.triangle(
        -halfSize, halfSize,
        0.5, halfSize * this.DIVOT_SIZE_COEFF,
        0.5, -halfSize
      );
      pInst.triangle(
        halfSize, halfSize,
        -0.5, halfSize * this.DIVOT_SIZE_COEFF,
        -0.5, -halfSize
      );
    }

    if (this.explosionRadius) {
      pInst.ellipse(0, 0, this.explosionRadius, this.explosionRadius);
    }
  }
};
