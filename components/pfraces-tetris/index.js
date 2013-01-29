var gen = require('gen'),
    engine;

var tetris = module.exports = function (config) {
  return new Tetris(config);
};

var private = {
  cursor: { x: 0, y: 0 }
};

var Tetris = function (config) {
  engine = gen(config);
};

Tetris.prototype.start = function () {
  engine.draw.board();
  engine.map.at(private.cursor).color = 'blue';
  engine.draw.cell(private.cursor);
};

Tetris.prototype.keymap = function (keymap) {
  engine.keymap = keymap;
};

Tetris.prototype.up = function () {
  /* player.move.up(); // teleport
     player.go.up(); // path finding */
  if (private.cursor.y === 0) return;
  engine.map.at(private.cursor).color = engine.board.cell.color;
  engine.draw.cell(private.cursor);
  private.cursor.y--;
  engine.map.at(private.cursor).color = 'blue';
  engine.draw.cell(private.cursor);
};

Tetris.prototype.down = function () {
  if (private.cursor.y === (engine.board.height - 1)) return;
  engine.map.at(private.cursor).color = engine.board.cell.color;
  engine.draw.cell(private.cursor);
  private.cursor.y++;
  engine.map.at(private.cursor).color = 'blue';
  engine.draw.cell(private.cursor);
};

Tetris.prototype.left = function () {
  if (private.cursor.x === 0) return;
  engine.map.at(private.cursor).color = engine.board.cell.color;
  engine.draw.cell(private.cursor);
  private.cursor.x--;
  engine.map.at(private.cursor).color = 'blue';
  engine.draw.cell(private.cursor);
};

Tetris.prototype.right = function () {
  if (private.cursor.x === (engine.board.width - 1)) return;
  engine.map.at(private.cursor).color = engine.board.cell.color;
  engine.draw.cell(private.cursor);
  private.cursor.x++;
  engine.map.at(private.cursor).color = 'blue';
  engine.draw.cell(private.cursor);
};
