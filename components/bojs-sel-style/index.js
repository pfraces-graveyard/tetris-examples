var style = module.exports = {
  pos: function (args) {
    var node = args.node;
    node.style.position = 'absolute';
    node.style.left = args.x; 
    node.style.top = args.y;
  },
  size: function (args) {
    var node = args.node;
    node.style.width = args.width;
    node.style.height = args.height;
  },
  color: function (args) {
    var node = args.node;
    if (args.bg) {
      node.style.background = args.bg;
    }
    if (args.fg) {
      node.style.color = args.fg;
    }
    if (args.opacity) {
      node.style.opacity = args.opacity;
    }
  },
  add: function (args) {
    args.node.className += ' ' + args.className;
  },
  del: function (args) {
    var node = args.node,
        regex = new RegExp('\\b' + args.className + '\\b');

    node.className = node.className.replace(regex);
  }
};
