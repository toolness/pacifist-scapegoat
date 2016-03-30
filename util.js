var Util = {
  isSpriteOffscreen: function(sprite, pInst) {
    pInst = pInst || window;

    var pos = sprite.position;
    var halfWidth = sprite.width / 2;
    var halfHeight = sprite.height / 2;

    return (pos.x + halfWidth < 0 || pos.x - halfWidth > pInst.width ||
            pos.y + halfHeight < 0 || pos.y - halfHeight > pInst.height);
  }
};
