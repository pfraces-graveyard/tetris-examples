var uid = require('uid'),
    sel = require('sel');

sel.plugin(
  require('sel-style'),
  require('sel-arrange')
);

module.exports = function (config, actors) {
  return new Render(config, actors);
};

var Render = function (config) {
  this.config = {
    cell: config.cell,
    fg: config.fg
  };

  this.board = sel('#' + config.id).
    size({
      width: (config.width * config.cell).toString() + 'px',
      height: (config.height * config.cell).toString() + 'px'
    }).
    color({ bg: config.bg });

  setInterval(config.frame, 1000 / config.fps);
};

Render.prototype.tile = function () {
  var cell = this.config.cell,
      tile = sel.div(id());

  tile.
    move({to: this.board, relative: true}).
    size({ 
      width: cell.toString() + 'px',
      height: cell.toString() + 'px'
    }).
    color({ bg: this.config.fg }); /* tile bg = config fg */

  return {
    move: function (x, y) {
      tile.pos({
        x: (x * cell).toString() + 'px',
        y: (y * cell).toString() + 'px',
      });
    }
  };
};

var id = uid(function (id) {
  return 'tile' + id;
});
