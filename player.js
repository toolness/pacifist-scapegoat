function Player(pInst) {
  pInst = pInst || window;
  this.pInst = pInst;
  this.sprite = pInst.createSprite(
    pInst.width / 2,
    pInst.height * 0.95,
    this.HITBOX_SIZE, this.HITBOX_SIZE
  );
  this.sprite.draw = this.draw.bind(this);
}

Player.prototype = {
  HITBOX_SIZE: 20,
  DISPLAY_SIZE_COEFF: 2,
  DIVOT_SIZE_COEFF: 0.8,
  SPEED: 4,
  processInput: function() {
    var pInst = this.pInst;
    var speed = this.SPEED;
    var angle = 0;
    var left = pInst.keyIsDown(pInst.LEFT_ARROW);
    var right = pInst.keyIsDown(pInst.RIGHT_ARROW);
    var up = pInst.keyIsDown(pInst.UP_ARROW);
    var down = pInst.keyIsDown(pInst.DOWN_ARROW);

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
    pInst.fill('white');
    pInst.triangle(
      -halfSize, halfSize,
      0, halfSize * this.DIVOT_SIZE_COEFF,
      0, -halfSize
    );
    pInst.triangle(
      halfSize, halfSize,
      0, halfSize * this.DIVOT_SIZE_COEFF,
      0, -halfSize
    );
  }
};
