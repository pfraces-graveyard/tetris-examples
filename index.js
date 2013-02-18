var tetris = require('tetris');

var game = tetris({
  id: 'board',
  width: 10,        /* cells */
  height: 17,       /* cells */
  cell: 50,         /* square pixels */
  bg: 'lightblue',
  fg: 'blue',
  fps: 25
});

game.keymap({
  up: game.up,
  down: game.down,
  left: game.left,
  right: game.right
});
