var arrange = module.exports = {
  move: function (args) {
    var node = args.to.first();
    node.appendChild(args.node);
    if (args.relative) {
      node.style.position = 'relative';
    }
  },
  del: function (args) {
    var node = args.node;
    node.parentNode.removeChild(node);
  },
  clear: function (args) {
    var node = args.node;
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }
};
