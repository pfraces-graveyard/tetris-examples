var tetris = require('tetris');

var game = tetris({
  id: 'board', /* canvas */
  width: 10, /* cells */
  height: 17, /* cells */
  cell: 50, /* pixels */
  bg: 'lightblue'
});

game.keymap({
  'up': game.up,
  'down': game.down,
  'left': game.left,
  'right': game.right
});
