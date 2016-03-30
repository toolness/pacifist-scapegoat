var stars;
var player;
var walls;
var projectiles;
var timer;
var enemies;
var score = 0;

function makeBullet(x, y) {
  var bullet = createSprite(x, y, 10, 10);

  bullet.shapeColor = color(255, 0, 150);
  bullet.depth = -10;
  projectiles.add(bullet);

  return bullet;
}

function spawnRandomEnemy() {
  var randInt = function(min, max) {
    return floor(random(min, max));
  };
  var enemyFactories = [
    function() {
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
    },
    function() {
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
  ];
  var enemyFactory = enemyFactories[randInt(0, enemyFactories.length)];
  var enemy = enemyFactory();

  enemies.add(enemy.sprite);

  return enemy;
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

  timer.interval(120, spawnRandomEnemy);
}

function draw() {
  var destroyPlayer = player.sprite.remove.bind(player.sprite);

  timer.update();

  background('black');
  stars.draw();
  drawSprites();
  text("score: " + score, 10, 20);

  if (!player.sprite.removed) {
    player.processInput();
    score++;
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
