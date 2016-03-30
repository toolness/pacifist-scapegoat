var stars;
var player;
var walls;
var projectiles;
var timer;
var enemies;
var font;
var titleText;
var playStarted = false;
var score = 0;

function makeBullet(x, y) {
  var bullet = createSprite(x, y, 10, 10);

  bullet.shapeColor = color(255, 0, 150);
  bullet.depth = -10;
  projectiles.add(bullet);

  return bullet;
}

function randInt(min, max) {
  return floor(random(min, max));
}

function randChoice(array) {
  return array[randInt(0, array.length)];
}

function createSpinnyEnemy() {
  var enemy = new Enemy(randInt(50, width - 50), -50, 15,
                        'yellow', timer);
  var count = 20;
  var angleIncrement = 360 / count;

  enemy.sprite.setSpeed(2, 90);

  enemy.add(enemy.timer.finiteInterval(15, count, function(i) {
    var b = makeBullet(enemy.sprite.position.x,
                       enemy.sprite.position.y);

    b.setSpeed(8, i * angleIncrement);
  }));

  return enemy;
}

function createSpurtyEnemy() {
  var enemy = new Enemy(-randInt(0, 200), -50, 15, 'pink', timer);

  enemy.sprite.setSpeed(3, randInt(30, 60));

  enemy.add(enemy.timer.interval(60, function() {
    return enemy.timer.finiteInterval(5, 5, function() {
      var b = makeBullet(enemy.sprite.position.x,
                         enemy.sprite.position.y);
      b.setSpeed(8, 90);
    });
  }));

  return enemy;
}

function spawnRandomEnemy() {
  var enemy = randChoice([
    createSpinnyEnemy,
    createSpurtyEnemy
  ])();

  enemies.add(enemy.sprite);

  return enemy;
}

function preload() {
  font = loadFont('vendor/OrbitronBold.otf');
}

function setup() {
  createCanvas(600, 800);
  timer = new Timer();
  stars = new Stars(200);
  player = new Player();
  walls = Walls.create();
  projectiles = new Group();
  enemies = new Group();
  //player.sprite.debug = true;

  textFont(font);

  titleText = new TitleText(timer);

  titleText.write(
    "Get ready, Human.\n\n" +
    "Use the arrow or WASD keys\nto move."
  ).then(function() {
    return timer.wait(160);
  }).then(function() {
    playStarted = true;
    return timer.interval(120, spawnRandomEnemy);
  });
}

function draw() {
  var destroyPlayer = player.sprite.remove.bind(player.sprite);

  timer.update();

  background('black');
  stars.draw();
  drawSprites();

  if (playStarted) {
    textSize(14);
    text("score: " + score, 10, 20);

    if (!player.sprite.removed) {
      score++;
    }
  } else {
    titleText.draw();
  }

  if (!player.sprite.removed) {
    player.processInput();
  }

  walls.displace(player.sprite);

  projectiles.overlap(player.sprite, destroyPlayer);
  enemies.overlap(player.sprite, destroyPlayer);

  projectiles.forEach(function(projectile) {
    if (Util.isSpriteOffscreen(projectile)) {
      projectile.remove();
    }
  });
}
