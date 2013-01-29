var tetris = require('tetris')({
  board: {
    id: 'board',
    width: 10,
    height: 17,
    cell: { color: '' }
  },
  cell: {
    width: 3,
    height: 3,
    unit: 'em'
  }
});

tetris.keymap({
  '8': tetris.up,
  '5': tetris.down,
  '4': tetris.left,
  '6': tetris.right
});

tetris.start();
