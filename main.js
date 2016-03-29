var stars;
var player;
var walls;
var projectiles;
var timer;
var score = 0;

function sprayBulletsFromTop(count) {
  return timer.finiteInterval(5, count, function() {
    makeBullet(random(width), 20).setSpeed(8, random(10, 170));
  });
}

function sprayBulletsFromCenter(count) {
  var angleIncrement = 360 / count;

  return timer.finiteInterval(5, count, function(i) {
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
  var sprayers = [
    sprayBulletsFromTop.bind(null, 10),
    sprayBulletsFromCenter.bind(null, 10)
  ];
  var sprayer = sprayers[floor(random(sprayers.length))];

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
