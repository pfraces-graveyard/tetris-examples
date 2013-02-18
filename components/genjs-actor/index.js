var id = require('uid')(),
    arrayize = require('arrayize'),
    dictionary = require('dictionary');

module.exports = function (pos, members) {
  return new Actor(pos, members);
};

var Actor = function (pos, members) {
  var self = this;
  this.id = id();
  this.actions = dictionary();
  this.x = pos.x;
  this.y = pos.y;

  this.last = {
    x: pos.x,
    y: pos.y
  };
  
  this.members = [];
  arrayize(members).forEach(function (member) {
    addMember(self, member);
  });

  this.move = {
    to: function (pos) {
      self.x = pos.x;
      self.y = pos.y;
    },
    back: function () {
      self.x = self.last.x; 
      self.y = self.last.y;
    },
    up: function () {
      self.x = self.x;
      self.y = self.y - 1;
    },
    down: function () {
      self.x = self.x;
      self.y = self.y + 1;
    },
    left: function () {
      self.x = self.x - 1; 
      self.y = self.y;
    },
    right: function () {
      self.x = self.x + 1;
      self.y = self.y;
    }
  }
};

Actor.prototype.add = function (member) {
  addMember(this, member);
  return this;
};

Actor.prototype.act = function (collisionDetecton) {
  var self = this;
  this.actions.each(function (action) {
    self.last.x = self.x;
    self.last.y = self.y;

    action();
    collisionDetecton();
  });
};

var addMember = function (actor, member) {
  actor.members.push({
    tile: member.tile,
    x: member.x,
    y: member.y
  });
};
