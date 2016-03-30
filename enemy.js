function Enemy(x, y, radius, color, pInst) {
  pInst = pInst || window;

  this.pInst = pInst;
  this.radius = radius;
  this.sprite = pInst.createSprite(x, y);
  this.sprite.shapeColor = pInst.color(color);
  this.sprite.draw = this.draw.bind(this);
  this.sprite.setCollider('circle', 0, 0, radius);
}

Enemy.prototype = {
  draw: function() {
    var pInst = this.pInst;

    pInst.noStroke();
    pInst.fill(this.sprite.shapeColor);
    pInst.ellipse(0, 0, this.radius * 2, this.radius * 2);
  }
};
