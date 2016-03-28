var stars;
var player;
var walls;

function setup() {
  createCanvas(600, 800);
  stars = new Stars(200);
  player = new Player();
  walls = Walls.create();
  //player.sprite.debug = true;
}

function draw() {
  background('black');
  stars.draw();
  drawSprites();

  player.processInput();

  walls.displace(player.sprite);
}
