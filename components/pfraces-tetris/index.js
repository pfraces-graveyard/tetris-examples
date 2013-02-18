var gen = require('gen'),
    shortcut = require('shortcut');

module.exports = function (config) {
  return new Tetris(config);
};

var Tetris = function (config) {
  this.engine = gen(config);
  this.player = this.engine.actor({ x: 0, y: 0 });

  var player = this.player;

  this.up = function (enable) {
    if (enable) {
      player.actions.set('up', player.move.up);
    } else {
      player.actions.del('up');
    }
  };

  this.down = function (enable) {
    if (enable) {
      player.actions.set('down', player.move.down);
    } else {
      player.actions.del('down');
    }
  };

  this.left = function (enable) {
    if (enable) {
      player.actions.set('left', player.move.left);
    } else {
      player.actions.del('left');
    }
  };

  this.right = function (enable) {
    if (enable) {
      player.actions.set('right', player.move.right);
    } else {
      player.actions.del('right');
    }
  };
};

Tetris.prototype.keymap = function (keymap) {
  Object.keys(keymap).forEach(function (key) {
    shortcut.on(key, function () {
      keymap[key](true);
    });
    shortcut.onEnd(key, function () {
      keymap[key]();
    });
  });
};
