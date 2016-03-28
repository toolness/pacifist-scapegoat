var stars;
var player;

function setup() {
  createCanvas(600, 800);
  stars = new Stars(200);
  player = new Player();
  player.sprite.debug = true;
}

function draw() {
  background('black');
  stars.draw();
  drawSprites();
}
