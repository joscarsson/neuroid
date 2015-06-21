(function() {
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
    size: 15
  };
  var lastStamp;

  ctx.fillStyle = "black";
  ctx.strokeStyle = "white";

  var render = function() {
    ctx.fillRect(0, 0, SIZE, SIZE);
    renderPlayer();
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
    movePlayer();
    wrapAround();
  };

  var movePlayer = function() {
    var rotMul = 0;

    if (keyState.left) rotMul = -1;
    else if (keyState.right) rotMul = 1;
    player.dir += rotMul * 0.1;

    if (keyState.up) {
      var thrust = 0.2;
      var thrustVec = [
        thrust * Math.cos(player.dir),
        thrust * Math.sin(player.dir),
      ];
      player.vel[0] += thrustVec[0];
      player.vel[1] += thrustVec[1];
    }

    player.pos[0] += player.vel[0];
    player.pos[1] += player.vel[1];
  };

  var wrapAround = function() {
    if (player.pos[0] < 0) player.pos[0] += SIZE;
    if (player.pos[1] < 0) player.pos[1] += SIZE;
    if (player.pos[0] > SIZE) player.pos[0] -= SIZE;
    if (player.pos[1] > SIZE) player.pos[1] -= SIZE;
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

