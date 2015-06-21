(function() {
  var ENGINE_THRUST = 0.2;
  var SIZE = 750;
  var TICK_LENGTH = 40;

  var canvas = document.getElementById('canvas');
  var keyState = {
    up: false,
    left: false,
    right: false,
    space: false
  };
  var ctx = canvas.getContext('2d');
  var player = {
    pos: [SIZE/2, SIZE/2],
    dir: 0,
    vel: [0, 0],
    size: 15,
  };
  var projectile;
  var asteroids = [
    { pos: [40, 40], vel: [2, 4], size: 15 },
    { pos: [250, 40], vel: [2, -4], size: 30 },
  ];
  var lastStamp;

  ctx.fillStyle = "black";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;

  var vecAdd = function(a, b) {
    a[0] += b[0];
    a[1] += b[1];
  }

  var render = function() {
    ctx.fillRect(0, 0, SIZE, SIZE);
    renderPlayer();
    renderProjectile();
    renderAsteroids();
  };

  var renderPlayer = function() {
    ctx.save();
    ctx.translate(player.pos[0], player.pos[1]);
    ctx.rotate(player.dir + Math.PI/2);
    var path = new Path2D();
    path.moveTo(0, -player.size);
    path.lineTo(-player.size/2, player.size);
    path.lineTo(player.size/2, player.size);
    path.lineTo(0, -player.size);
    ctx.stroke(path);
    ctx.restore();
  };

  var renderProjectile = function() {
    if (!projectile) return;
    ctx.save();
    ctx.fillStyle = "white";
    var path = new Path2D();
    path.arc(projectile.pos[0], projectile.pos[1], 2, 0, Math.PI*2, true);
    ctx.fill(path);
    ctx.restore();
  };

  var renderAsteroids = function() {
    asteroids.forEach(function(a) {
      ctx.save();
      ctx.translate(a.pos[0], a.pos[1]);
      var path = new Path2D();
      path.arc(0, 0, a.size, 0, Math.PI*2, true);
      ctx.stroke(path);
      ctx.restore();
    });
  };

  var keySetter = function(keyCode, value) {
    switch (keyCode) {
      case 32:
        keyState.space = value;
        break;
      case 37:
        keyState.left = value;
        break;
      case 38:
        keyState.up = value;
        break;
      case 39:
        keyState.right = value;
        break;
    }
  }

  document.addEventListener('keydown', function(e) {
    keySetter(e.keyCode, true);
  });

  document.addEventListener('keyup', function(e) {
    keySetter(e.keyCode, false);
  });

  var calculate = function() {
    playerMove();
    playerShoot();
    asteroidsMove();

    wrapAround(player.pos);
    if (projectile) wrapAround(projectile.pos);
    asteroids.forEach(function(a) { wrapAround(a.pos); });
  };

  var playerMove = function() {
    var rotMul = 0;

    if (keyState.left) rotMul = -1;
    else if (keyState.right) rotMul = 1;
    player.dir += rotMul * 0.1;

    if (keyState.up) {
      var thrustVec = [
        ENGINE_THRUST * Math.cos(player.dir),
        ENGINE_THRUST * Math.sin(player.dir),
      ];
      vecAdd(player.vel, thrustVec);
    }

    vecAdd(player.pos, player.vel);
  };

  var playerShoot = function() {
    if (projectile) {
      projectile.reach -= 1;
      if (projectile.reach == 0) projectile = null;
      else vecAdd(projectile.pos, projectile.vel);
    } else if (keyState.space) {
      projectile = {
        pos: [player.pos[0], player.pos[1]],
        vel: [
          12 * Math.cos(player.dir),
          12 * Math.sin(player.dir)
        ],
        reach: 30
      }
      vecAdd(projectile.pos, [1.1 * projectile.vel[0], 1.1 * projectile.vel[1]]);
    }
  };

  var asteroidsMove = function() {
    asteroids.forEach(function(a) {
      vecAdd(a.pos, a.vel);
    });

    if (Math.random() < 0.01) {
      asteroids.push({
        pos: [Math.random() * SIZE, Math.random() * SIZE],
        vel: [Math.random() * 8 - 4, Math.random() * 8 - 4],
        size: Math.random() * 20 + 10
      });
    }
  };

  var wrapAround = function(pos) {
    if (pos[0] < 0) pos[0] += SIZE;
    if (pos[1] < 0) pos[1] += SIZE;
    if (pos[0] > SIZE) pos[0] -= SIZE;
    if (pos[1] > SIZE) pos[1] -= SIZE;
  };

  var main = function(stamp) {


    requestAnimationFrame(main);

    render();

    var nextTick = lastStamp + TICK_LENGTH;
    var ticks = 0;

    if (stamp > nextTick) {
      ticks = Math.floor((stamp - lastStamp) / TICK_LENGTH);
    }

    for (var i = 0; i < ticks; i++) {
      lastStamp = lastStamp + TICK_LENGTH;
      calculate();
    }
  };

  lastStamp = performance.now();
  main(performance.now());
})();

