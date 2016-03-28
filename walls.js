var Walls = {
  create: function(pInst) {
    pInst = pInst || window;

    var walls = new pInst.Group();
    var width = pInst.width;
    var height = pInst.height;
    var middleY = pInst.height / 2;
    var middleX = pInst.width / 2;
    var makeWall = function(x, y, w, h) {
      var wall = pInst.createSprite(x, y, w, h);
      wall.draw = function() {};
      //wall.debug = true;
      walls.add(wall);
    };

    makeWall(0, middleY, 1, height);
    makeWall(width, middleY, 1, height);
    makeWall(middleX, 0, width, 1);
    makeWall(middleX, height, width, 1);

    return walls;
  }
};
