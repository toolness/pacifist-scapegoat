var stars;
var player;
var walls;
var projectiles;
var timer;
var score = 0;

function sprayBulletsFromTop(count) {
  var promise = Promise.resolve();

  for (var i = 0; i < count; i++) {
    promise = promise.then(function() {
      makeBullet(random(width), 20).setSpeed(8, random(10, 170));
    }).then(function() {
      return timer.wait(5);
    });
  }

  return promise;
}

function makeBullet(x, y) {
  var bullet = createSprite(x, y, 10, 10);

  bullet.shapeColor = color(255, 0, 150);
  projectiles.add(bullet);

  return bullet;
}

function keepMakingBullets(msInterval) {
  return sprayBulletsFromTop(10).then(function() {
    return timer.wait(msInterval);
  }).then(function() {
    return keepMakingBullets(msInterval);
  });
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
