var GAME_STATE_INTRO = 1;
var GAME_STATE_PLAYING = 2;
var GAME_STATE_OVER = 3;

var stars;
var player;
var walls;
var projectiles;
var timer;
var enemies;
var font;
var titleText;
var fadeToWhite = 0;
var explosionRadius = 0;
var gameState = GAME_STATE_INTRO;
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
  if (gameState === GAME_STATE_OVER) return;

  var enemy = randChoice([
    createSpinnyEnemy,
    createSpurtyEnemy
  ])();

  enemies.add(enemy.sprite);
}

function gameOver() {
  if (gameState === GAME_STATE_OVER) return;

  var FADE_FRAMES = 15;
  var EXPLODE_FRAMES = 30;
  var EXPLODE_MAX_RADIUS = max(width, height) * 2;
  var EXPLODE_INCREMENT = EXPLODE_MAX_RADIUS / EXPLODE_FRAMES;
  var FADE_INCREMENT = 255 / FADE_FRAMES;

  gameState = GAME_STATE_OVER;
  titleText.reset();
  player.sprite.setSpeed(0, 0);

  timer.finiteInterval(1, EXPLODE_FRAMES, function() {
    explosionRadius += EXPLODE_INCREMENT;
  }).then(function() {
    explosionRadius = 0;
    player.sprite.remove();
    fadeToWhite = 255;
    return timer.finiteInterval(1, FADE_FRAMES, function() {
      fadeToWhite -= FADE_INCREMENT;
    });
  }).then(function() {
    titleText.write(
      "Human.\n\n" +
      "You have failed utterly.\n\n" +
      "Your final score is " + score + "."
    );
  });
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
    gameState = GAME_STATE_PLAYING;
    return timer.interval(120, spawnRandomEnemy);
  });
}

function draw() {
  timer.update();

  background('black');
  stars.draw();
  drawSprites();

  switch (gameState) {
    case GAME_STATE_INTRO:
    case GAME_STATE_OVER:
      titleText.draw();
      break;

    case GAME_STATE_PLAYING:
      textSize(14);
      text("score: " + score, 10, 20);
      score++;
  }

  if (gameState === GAME_STATE_OVER) {
    if (explosionRadius) {
      ellipse(player.sprite.position.x, player.sprite.position.y,
              explosionRadius, explosionRadius);
    }
  } else {
    player.processInput();
  }

  walls.displace(player.sprite);

  projectiles.overlap(player.sprite, gameOver);
  enemies.overlap(player.sprite, gameOver);

  projectiles.forEach(function(projectile) {
    if (Util.isSpriteOffscreen(projectile)) {
      projectile.remove();
    }
  });

  if (fadeToWhite) {
    background(color(255, 255, 255, fadeToWhite));
  }
}
