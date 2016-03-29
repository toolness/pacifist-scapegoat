var stars;
var player;
var walls;
var projectiles;
var timer;
var score = 0;

function makeBullets() {
  for (var i = 0; i < 10; i++) {
    var bullet = createSprite(random(width), 20, 10, 10);

    bullet.shapeColor = color(255, 0, 150);
    bullet.setSpeed(8, random(10, 170));
    projectiles.add(bullet);
  }
}

function keepMakingBullets(msInterval) {
  makeBullets();
  return timer.wait(msInterval).then(keepMakingBullets.bind(null, msInterval));
}

function setup() {
  createCanvas(600, 800);
  timer = new Timer();
  stars = new Stars(200);
  player = new Player();
  walls = Walls.create();
  projectiles = new Group();
  //player.sprite.debug = true;

  keepMakingBullets(120);
}

function draw() {
  timer.update();

  background('black');
  stars.draw();
  drawSprites();
  text("score: " + score, 10, 20);

  if (!player.dead) {
    player.processInput();
    score++;
  }

  walls.displace(player.sprite);
  projectiles.overlap(player.sprite, function() {
    player.sprite.remove();
    player.dead = true;

  });
}
