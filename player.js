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
