var stars;
var player;
var walls;
var projectiles;
var timer;
var score = 0;

function sprayBulletsFromTop(frames, count) {
  return timer.finiteInterval(frames, count, function() {
    makeBullet(random(width), 20).setSpeed(8, random(10, 170));
  });
}

function sprayBulletsFromCenter(frames, count) {
  var angleIncrement = 360 / count;

  return timer.finiteInterval(frames, count, function(i) {
    makeBullet(width / 2, height / 2).setSpeed(8, i * angleIncrement);
  });
}

function makeBullet(x, y) {
  var bullet = createSprite(x, y, 10, 10);

  bullet.shapeColor = color(255, 0, 150);
  projectiles.add(bullet);

  return bullet;
}

function sprayBulletsRandomly() {
  var randInt = function(min, max) {
    return floor(random(min, max));
  };
  var sprayers = [
    function() {
      return sprayBulletsFromTop(randInt(3, 8), randInt(5, 15));
    },
    function() {
      return sprayBulletsFromCenter(randInt(3, 8), randInt(5, 15));
    }
  ];
  var sprayer = sprayers[randInt(0, sprayers.length)];

  return sprayer();
}

function setup() {
  createCanvas(600, 800);
  timer = new Timer();
  stars = new Stars(200);
  player = new Player();
  walls = Walls.create();
  projectiles = new Group();
  //player.sprite.debug = true;

  timer.interval(120, sprayBulletsRandomly);
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
