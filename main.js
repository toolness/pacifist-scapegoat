var GAME_STATE_INTRO = 1;
var GAME_STATE_PLAYING = 2;
var GAME_STATE_OVER = 3;
var BULLET_SPEED = 8;

var stars;
var player;
var walls;
var projectiles;
var timer;
var enemies;
var font;
var titleText;
var gameState = GAME_STATE_INTRO;
var score = 0;

var ENABLE_PLAYER_AI = /\?ai=true/.test(window.location.search);

function makeBullet(pos, angle) {
  var bullet = createSprite(pos.x, pos.y, 10, 10);

  bullet.shapeColor = color(255, 0, 150);
  bullet.depth = -10;
  projectiles.add(bullet);

  if (typeof(angle) === 'number') {
    bullet.setSpeed(BULLET_SPEED, angle);
  } else {
    bullet.velocity.x = angle.x * BULLET_SPEED;
    bullet.velocity.y = angle.y * BULLET_SPEED;
  }

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
    makeBullet(enemy.sprite.position, i * angleIncrement);
  }));

  return enemy;
}

function createSpurtyEnemy() {
  var shootAtPlayer = random() > 0.75;
  var col = shootAtPlayer ? 'orange' : 'pink';
  var enemy = new Enemy(-randInt(0, 200), -50, 15, col, timer);

  enemy.sprite.setSpeed(3, randInt(30, 60));

  enemy.add(enemy.timer.interval(60, function() {
    return enemy.timer.finiteInterval(5, 5, function() {
      var angle;

      if (shootAtPlayer) {
        angle = p5.Vector.sub(player.sprite.position,
                              enemy.sprite.position).normalize();
      } else {
        angle = 90;
      }

      makeBullet(enemy.sprite.position, angle);
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
}

function gamePlaying() {
  gameState = GAME_STATE_PLAYING;
  return timer.interval(120, function() {
    if (gameState === GAME_STATE_OVER) return Timer.STOP_INTERVAL;
    spawnRandomEnemy();
  });
}

function gameOver() {
  if (gameState === GAME_STATE_OVER) return;

  gameState = GAME_STATE_OVER;
  titleText.reset();
  player.explode().then(function() {
    titleText.write(
      "Human.\n\n" +
      "You have failed utterly.\n\n" +
      "Your final score is " + score + "."
    );
  });
  if (ENABLE_PLAYER_AI) {
    AI.onGameOver(score);
  }
}

function preload() {
  font = loadFont('vendor/OrbitronBold.otf');
}

function setup() {
  createCanvas(600, 800);
  timer = new Timer();
  stars = new Stars(200);
  player = new Player(timer);
  walls = Walls.create();
  projectiles = new Group();
  enemies = new Group();
  //player.sprite.debug = true;

  textFont(font);

  titleText = new TitleText(timer);

  if (ENABLE_PLAYER_AI) {
    return gamePlaying();
  }

  titleText.write(
    "Get ready, Human.\n\n" +
    "Use the arrow or WASD keys\nto move."
  ).then(function() {
    return timer.wait(160);
  }).then(gamePlaying);
}

function draw() {
  var input;

  if (ENABLE_PLAYER_AI) {
    input = AI.getInput();
  } else {
    input = Keyboard.getInput();
  }

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

  player.processInput(input);

  walls.displace(player.sprite);

  projectiles.overlap(player.sprite, gameOver);
  enemies.overlap(player.sprite, gameOver);

  projectiles.forEach(function(projectile) {
    if (Util.isSpriteOffscreen(projectile)) {
      projectile.remove();
    }
  });
}
