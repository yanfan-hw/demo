window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  BocksLayout: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1e62cz1tsFKjawO1MKdkTYI", "BocksLayout");
    "use strict";
    var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    var V = require("Variables");
    var Emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        BlockPrefab: cc.Prefab,
        gap: 20,
        flag: true,
        isCompleted: true,
        isMerged: false
      },
      onLoad: function onLoad() {
        Emitter.instance.emit("transBlocksLayout", this);
      },
      createdBlock: function createdBlock(width, height, x, y, label) {
        var block = cc.instantiate(this.BlockPrefab);
        block.width = width;
        block.height = height;
        block.parent = this.node;
        block.setPosition(cc.v2(x, y));
        block.getComponent("Block").setLabel(label);
        return block;
      },
      createBlocksLayout: function createBlocksLayout() {
        var y = 700;
        var distance = 20;
        var size = 150;
        for (var row = 0; row < 4; row++) {
          V.positions.push([ 0, 0, 0, 0 ]);
          var x = 200;
          for (var col = 0; col < V.cols; col++) {
            this.createdBlock(size, size, x, y, 0);
            V.positions[row][col] = cc.v2(x, y);
            x += distance + size;
          }
          y -= distance + size;
        }
      },
      init: function init() {
        for (var i = 0; i < 4; i++) {
          V.blocks.push([ null, null, null, null ]);
          V.data.push([ 0, 0, 0, 0 ]);
        }
        this.randomBlock();
        this.randomBlock();
      },
      getEmptyLocations: function getEmptyLocations() {
        var emptyLocations = [];
        for (var row = 0; row < 4; row++) for (var col = 0; col < 4; col++) null == V.blocks[row][col] && emptyLocations.push({
          x: row,
          y: col
        });
        return emptyLocations;
      },
      randomBlock: function randomBlock() {
        var emptyLocations = this.getEmptyLocations();
        if ("" == emptyLocations) return;
        var locationRandom = emptyLocations[Math.floor(Math.random() * emptyLocations.length)];
        var x = locationRandom.x;
        var y = locationRandom.y;
        var size = 150;
        var numberRandom = V.numbers[Math.floor(Math.random() * V.numbers.length)];
        var block = this.createdBlock(size, size, V.positions[x][y].x, V.positions[x][y].y, numberRandom);
        V.blocks[x][y] = block;
        V.data[x][y] = numberRandom;
        return true;
      },
      mergeNode: function mergeNode(b1, b2, num) {
        b1.destroy();
        var scale1 = cc.scaleTo(.1, 1.1);
        var scale2 = cc.scaleTo(.1, 1);
        var mid = cc.callFunc(function() {
          b2.getComponent("Block").setLabel(num);
        });
        var finished = cc.callFunc(function() {});
        b2.runAction(cc.sequence(scale1, mid, scale2, finished));
      },
      afterMove: function afterMove(hasMoved) {
        this.randomBlock();
      },
      mergeUpData: function mergeUpData(col) {
        var _this = this;
        var _loop = function _loop(row) {
          if (0 == V.data[row][col] || 0 == row) return {
            v: void 0
          };
          if (V.data[row - 1][col] == V.data[row][col]) {
            var block = V.blocks[row][col];
            var block1 = V.blocks[row - 1][col];
            var positionToMove = V.positions[row - 1][col];
            V.data[row - 1][col] *= 2;
            V.data[row][col] = 0;
            V.blocks[row][col] = null;
            var actionsMove = [ cc.moveTo(.05, positionToMove), cc.callFunc(function() {
              _this.isCompleted = true;
            }) ];
            block.runAction(cc.sequence(actionsMove));
            var actionsMerge = [ cc.callFunc(function() {
              _this.mergeNode(block, block1, V.data[row - 1][col]);
            }), cc.callFunc(function() {}) ];
            block1.runAction(cc.sequence(actionsMerge));
            return {
              v: void 0
            };
          }
        };
        for (var row = 3; row >= 0; row--) {
          var _ret = _loop(row);
          if ("object" === ("undefined" === typeof _ret ? "undefined" : _typeof(_ret))) return _ret.v;
        }
      },
      mergeDown: function mergeDown(col) {
        var _this2 = this;
        console.log("Dow");
        var _loop2 = function _loop2(row) {
          if (3 == row) {
            console.log("return");
            return {
              v: void 0
            };
          }
          if (V.data[row + 1][col] == V.data[row][col] && 0 != V.data[row + 1][col]) {
            console.log("===sequence");
            _this2.isMerged = true;
            var block = V.blocks[row][col];
            var block1 = V.blocks[row + 1][col];
            var positionToMove = V.positions[row + 1][col];
            V.data[row + 1][col] *= 2;
            V.data[row][col] = 0;
            V.blocks[row][col] = null;
            var actionsMove = [ cc.moveTo(.05, positionToMove), cc.callFunc(function() {
              _this2.isCompleted = true;
            }) ];
            block.runAction(cc.sequence(actionsMove));
            var actionsMerge = [ cc.callFunc(function() {
              _this2.mergeNode(block, block1, V.data[row + 1][col]);
            }), cc.callFunc(function() {}) ];
            block1.runAction(cc.sequence(actionsMerge));
            return {
              v: void 0
            };
          }
        };
        for (var row = 0; row < 4; row++) {
          var _ret2 = _loop2(row);
          if ("object" === ("undefined" === typeof _ret2 ? "undefined" : _typeof(_ret2))) return _ret2.v;
        }
      },
      moveDown: function moveDown(row, col) {
        var _this3 = this;
        this.isCompleted = false;
        if (3 == row || 0 == V.data[row][col]) {
          this.mergeDown(col);
          return;
        }
        var block = V.blocks[row][col];
        var positionToMove = V.positions[row + 1][col];
        if (0 == V.data[row + 1][col]) {
          V.blocks[row + 1][col] = block;
          V.data[row + 1][col] = V.data[row][col];
          V.data[row][col] = 0;
          V.blocks[row][col] = null;
          var actions = [ cc.moveTo(.05, positionToMove), cc.callFunc(function() {
            _this3.moveDown(row + 1, col);
          }), cc.callFunc(function() {
            _this3.isCompleted = true;
          }) ];
          block.runAction(cc.sequence(actions));
          return;
        }
        this.moveDown(row + 1, col);
        this.isCompleted = true;
        return;
      },
      mergeRight: function mergeRight(row) {
        var _this4 = this;
        console.log(row);
        var _loop3 = function _loop3(col) {
          if (0 == V.data[row][col]) return {
            v: void 0
          };
          if (V.data[row][col - 1] == V.data[row][col] && 0 != V.data[row][col - 1]) {
            _this4.isMerged = true;
            var block = V.blocks[row][col - 1];
            var block1 = V.blocks[row][col];
            var positionToMove = V.positions[row][col];
            V.data[row][col] *= 2;
            V.data[row][col - 1] = 0;
            V.blocks[row][col - 1] = null;
            var actionsMove = [ cc.moveTo(.05, positionToMove), cc.callFunc(function() {
              _this4.isCompleted = true;
            }) ];
            block.runAction(cc.sequence(actionsMove));
            var actionsMerge = [ cc.callFunc(function() {
              _this4.mergeNode(block, block1, V.data[row][col]);
            }), cc.callFunc(function() {}) ];
            block1.runAction(cc.sequence(actionsMerge));
            return {
              v: void 0
            };
          }
        };
        for (var col = 3; col >= 0; col--) {
          var _ret3 = _loop3(col);
          if ("object" === ("undefined" === typeof _ret3 ? "undefined" : _typeof(_ret3))) return _ret3.v;
        }
      },
      moveRight: function moveRight(row, col) {
        var _this5 = this;
        this.isCompleted = false;
        if (3 == col || 0 == V.data[row][col]) {
          this.mergeRight(row);
          return;
        }
        var block = V.blocks[row][col];
        var positionToMove = V.positions[row][col + 1];
        if (0 == V.data[row][col + 1]) {
          V.blocks[row][col + 1] = block;
          V.data[row][col + 1] = V.data[row][col];
          V.data[row][col] = 0;
          V.blocks[row][col] = null;
          var actions = [ cc.moveTo(.05, positionToMove), cc.callFunc(function() {
            _this5.moveRight(row, col + 1);
          }), cc.callFunc(function() {
            _this5.isCompleted = true;
          }) ];
          block.runAction(cc.sequence(actions));
          return;
        }
        this.moveRight(row, col + 1);
        this.isCompleted = true;
        return;
      },
      mergeLeft: function mergeLeft(row) {
        var _this6 = this;
        var _loop4 = function _loop4(col) {
          if (0 == V.data[row][col]) return {
            v: void 0
          };
          if (V.data[row][col] == V.data[row][col + 1]) {
            var block = V.blocks[row][col + 1];
            var block1 = V.blocks[row][col];
            var positionToMove = V.positions[row][col];
            V.data[row][col] *= 2;
            V.data[row][col + 1] = 0;
            V.blocks[row][col + 1] = null;
            var actionsMove = [ cc.moveTo(.05, positionToMove), cc.callFunc(function() {
              _this6.isCompleted = true;
            }) ];
            block.runAction(cc.sequence(actionsMove));
            var actionsMerge = [ cc.callFunc(function() {
              _this6.mergeNode(block, block1, V.data[row][col]);
            }), cc.callFunc(function() {}) ];
            block1.runAction(cc.sequence(actionsMerge));
            return {
              v: void 0
            };
          }
        };
        for (var col = 0; col < 4; col++) {
          var _ret4 = _loop4(col);
          if ("object" === ("undefined" === typeof _ret4 ? "undefined" : _typeof(_ret4))) return _ret4.v;
        }
      },
      moveLeft: function moveLeft(row, col) {
        var _this7 = this;
        this.isCompleted = false;
        if (0 == col || 0 == V.data[row][col]) {
          this.mergeLeft(row);
          return;
        }
        var block = V.blocks[row][col];
        var positionToMove = V.positions[row][col - 1];
        if (0 == V.data[row][col - 1]) {
          V.blocks[row][col - 1] = block;
          V.data[row][col - 1] = V.data[row][col];
          V.data[row][col] = 0;
          V.blocks[row][col] = null;
          var actions = [ cc.moveTo(.05, positionToMove), cc.callFunc(function() {
            _this7.moveLeft(row, col - 1);
          }), cc.callFunc(function() {
            _this7.isCompleted = true;
          }) ];
          block.runAction(cc.sequence(actions));
          return;
        }
        this.moveLeft(row, col - 1);
        this.isCompleted = true;
        return;
      },
      moveUp: function moveUp(row, col) {
        var _this8 = this;
        this.isCompleted = false;
        if (0 == row || 0 == V.data[row][col]) {
          this.mergeUpData(col);
          return;
        }
        var block = V.blocks[row][col];
        var positionToMove = V.positions[row - 1][col];
        if (0 == V.data[row - 1][col]) {
          V.blocks[row - 1][col] = block;
          V.data[row - 1][col] = V.data[row][col];
          V.data[row][col] = 0;
          V.blocks[row][col] = null;
          var actions = [ cc.moveTo(.05, positionToMove), cc.callFunc(function() {
            _this8.moveUp(row - 1, col);
          }), cc.callFunc(function() {
            _this8.isCompleted = true;
          }) ];
          block.runAction(cc.sequence(actions));
          return;
        }
        this.moveUp(row - 1, col);
        this.isCompleted = true;
        return;
      },
      inputUp: function inputUp() {
        var _this9 = this;
        var nodesToMove = this.getNodeToMove();
        console.log(nodesToMove);
        var _loop5 = function _loop5(i) {
          var actions = [ cc.callFunc(function() {
            _this9.moveUp(nodesToMove[i].x, nodesToMove[i].y);
          }), cc.callFunc(function() {
            _this9.isMerged = false;
          }), cc.delayTime(.1), cc.callFunc(function() {
            0 == i && _this9.randomBlock();
          }) ];
          _this9.node.runAction(cc.sequence(actions));
        };
        for (var i = 0; i < nodesToMove.length; i++) _loop5(i);
      },
      inputDown: function inputDown() {
        var _this10 = this;
        var nodesToMove = this.getNodeToMove();
        console.log(nodesToMove);
        var _loop6 = function _loop6(i) {
          var actions = [ cc.callFunc(function() {
            _this10.moveDown(nodesToMove[i].x, nodesToMove[i].y);
          }), cc.callFunc(function() {
            _this10.isMerged = false;
          }), cc.delayTime(.1), cc.callFunc(function() {
            0 == i && _this10.randomBlock();
          }) ];
          _this10.node.runAction(cc.sequence(actions));
        };
        for (var i = nodesToMove.length - 1; i >= 0; i--) _loop6(i);
      },
      inputLeft: function inputLeft() {
        var _this11 = this;
        var nodesToMove = this.getNodeToMove();
        var _loop7 = function _loop7(i) {
          var actions = [ cc.callFunc(function() {
            _this11.moveLeft(nodesToMove[i].x, nodesToMove[i].y);
          }), cc.delayTime(.2), cc.callFunc(function() {
            _this11.isMerged = false;
          }), cc.delayTime(.1), cc.callFunc(function() {
            if (0 == i) {
              console.log("randomBlock");
              _this11.randomBlock();
            }
          }) ];
          _this11.node.runAction(cc.sequence(actions));
        };
        for (var i = 0; i < nodesToMove.length; i++) _loop7(i);
      },
      inputRight: function inputRight() {
        var _this12 = this;
        var nodesToMove = this.getNodeToMove();
        var _loop8 = function _loop8(i) {
          var actions = [ cc.callFunc(function() {
            _this12.moveRight(nodesToMove[i].x, nodesToMove[i].y);
          }), cc.callFunc(function() {
            _this12.isMerged = false;
          }), cc.delayTime(.1), cc.callFunc(function() {
            if (0 == i) {
              console.log("randomBlock");
              _this12.randomBlock();
            }
          }) ];
          _this12.node.runAction(cc.sequence(actions));
        };
        for (var i = nodesToMove.length - 1; i >= 0; i--) _loop8(i);
      },
      getNodeToMove: function getNodeToMove() {
        var nodesToMove = [];
        for (var row = 0; row < 4; row++) for (var col = 0; col < 4; col++) 0 != V.data[row][col] && nodesToMove.push({
          x: row,
          y: col
        });
        return nodesToMove;
      },
      start: function start() {
        this.createBlocksLayout();
        this.init();
      }
    });
    cc._RF.pop();
  }, {
    Variables: "Variables",
    mEmitter: "mEmitter"
  } ],
  1: [ function(require, module, exports) {
    function EventEmitter() {
      this._events = this._events || {};
      this._maxListeners = this._maxListeners || void 0;
    }
    module.exports = EventEmitter;
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.prototype._events = void 0;
    EventEmitter.prototype._maxListeners = void 0;
    EventEmitter.defaultMaxListeners = 10;
    EventEmitter.prototype.setMaxListeners = function(n) {
      if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError("n must be a positive number");
      this._maxListeners = n;
      return this;
    };
    EventEmitter.prototype.emit = function(type) {
      var er, handler, len, args, i, listeners;
      this._events || (this._events = {});
      if ("error" === type && (!this._events.error || isObject(this._events.error) && !this._events.error.length)) {
        er = arguments[1];
        if (er instanceof Error) throw er;
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ")");
        err.context = er;
        throw err;
      }
      handler = this._events[type];
      if (isUndefined(handler)) return false;
      if (isFunction(handler)) switch (arguments.length) {
       case 1:
        handler.call(this);
        break;

       case 2:
        handler.call(this, arguments[1]);
        break;

       case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;

       default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
      } else if (isObject(handler)) {
        args = Array.prototype.slice.call(arguments, 1);
        listeners = handler.slice();
        len = listeners.length;
        for (i = 0; i < len; i++) listeners[i].apply(this, args);
      }
      return true;
    };
    EventEmitter.prototype.addListener = function(type, listener) {
      var m;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      this._events || (this._events = {});
      this._events.newListener && this.emit("newListener", type, isFunction(listener.listener) ? listener.listener : listener);
      this._events[type] ? isObject(this._events[type]) ? this._events[type].push(listener) : this._events[type] = [ this._events[type], listener ] : this._events[type] = listener;
      if (isObject(this._events[type]) && !this._events[type].warned) {
        m = isUndefined(this._maxListeners) ? EventEmitter.defaultMaxListeners : this._maxListeners;
        if (m && m > 0 && this._events[type].length > m) {
          this._events[type].warned = true;
          console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[type].length);
          "function" === typeof console.trace && console.trace();
        }
      }
      return this;
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.once = function(type, listener) {
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      var fired = false;
      function g() {
        this.removeListener(type, g);
        if (!fired) {
          fired = true;
          listener.apply(this, arguments);
        }
      }
      g.listener = listener;
      this.on(type, g);
      return this;
    };
    EventEmitter.prototype.removeListener = function(type, listener) {
      var list, position, length, i;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      if (!this._events || !this._events[type]) return this;
      list = this._events[type];
      length = list.length;
      position = -1;
      if (list === listener || isFunction(list.listener) && list.listener === listener) {
        delete this._events[type];
        this._events.removeListener && this.emit("removeListener", type, listener);
      } else if (isObject(list)) {
        for (i = length; i-- > 0; ) if (list[i] === listener || list[i].listener && list[i].listener === listener) {
          position = i;
          break;
        }
        if (position < 0) return this;
        if (1 === list.length) {
          list.length = 0;
          delete this._events[type];
        } else list.splice(position, 1);
        this._events.removeListener && this.emit("removeListener", type, listener);
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function(type) {
      var key, listeners;
      if (!this._events) return this;
      if (!this._events.removeListener) {
        0 === arguments.length ? this._events = {} : this._events[type] && delete this._events[type];
        return this;
      }
      if (0 === arguments.length) {
        for (key in this._events) {
          if ("removeListener" === key) continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = {};
        return this;
      }
      listeners = this._events[type];
      if (isFunction(listeners)) this.removeListener(type, listeners); else if (listeners) while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
      delete this._events[type];
      return this;
    };
    EventEmitter.prototype.listeners = function(type) {
      var ret;
      ret = this._events && this._events[type] ? isFunction(this._events[type]) ? [ this._events[type] ] : this._events[type].slice() : [];
      return ret;
    };
    EventEmitter.prototype.listenerCount = function(type) {
      if (this._events) {
        var evlistener = this._events[type];
        if (isFunction(evlistener)) return 1;
        if (evlistener) return evlistener.length;
      }
      return 0;
    };
    EventEmitter.listenerCount = function(emitter, type) {
      return emitter.listenerCount(type);
    };
    function isFunction(arg) {
      return "function" === typeof arg;
    }
    function isNumber(arg) {
      return "number" === typeof arg;
    }
    function isObject(arg) {
      return "object" === typeof arg && null !== arg;
    }
    function isUndefined(arg) {
      return void 0 === arg;
    }
  }, {} ],
  Game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cc8e1SvUpBJdL6+HQ+xTD5z", "Game");
    "use strict";
    var V = require("Variables");
    var Emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        Emitter.instance = new Emitter();
        Emitter.instance.registerEvent("transBlocksLayout", this.transBlocksLayout, this);
        Emitter.instance.registerEvent("transBlock", this.transBlock, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      },
      transBlocksLayout: function transBlocksLayout(data) {
        V.blocksLayout = data;
      },
      transBlock: function transBlock(data) {
        V.block = data;
      },
      start: function start() {},
      onKeyDown: function onKeyDown(event) {
        switch (event.keyCode) {
         case cc.macro.KEY.down:
          console.log("Press a key DOWN");
          V.blocksLayout.inputDown();
          break;

         case cc.macro.KEY.up:
          console.log("Press a key UP");
          V.blocksLayout.inputUp();
          break;

         case cc.macro.KEY.left:
          console.log("Press a key LEFT");
          V.blocksLayout.inputLeft();
          break;

         case cc.macro.KEY.right:
          console.log("Press a key RIGHT");
          V.blocksLayout.inputRight();
          break;

         default:
          return;
        }
      }
    });
    cc._RF.pop();
  }, {
    Variables: "Variables",
    mEmitter: "mEmitter"
  } ],
  LoseGame: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "23a29CTqBlC1bFaQF0Hwhuw", "LoseGame");
    "use strict";
    var Emitter = require("mEmitter");
    var V = require("Variables");
    cc.Class({
      extends: cc.Component,
      properties: {
        playAgainBtn: cc.Node,
        labelScore: cc.Label,
        boardGame: cc.Node,
        Ala: cc.Node
      },
      onLoad: function onLoad() {
        Emitter.instance.registerEvent("showPopupLoseGame", this._animOpenPopup.bind(this));
        this.node.y = 1e3;
        this.node.active = false;
      },
      _animOpenPopup: function _animOpenPopup(score) {
        var _this = this;
        this.node.active = true;
        V.game.enabled = false;
        V.audio.playSoundLose();
        this._animAla();
        cc.tween(this.boardGame).to(.5, {
          opacity: 50
        }).start();
        cc.tween(this.node).to(1, {
          position: cc.v2(0, 0)
        }, {
          easing: "backInOut"
        }).call(function() {
          _this._animOpenBtnPlayAgain();
          _this.labelScore.string = 0;
          _this._animScore(score);
        }).start();
      },
      _animationBtn: function _animationBtn() {},
      _animHidePopup: function _animHidePopup() {
        cc.tween(this.boardGame).to(.5, {
          opacity: 255
        }).start();
        cc.tween(this.node).to(1, {
          position: cc.v2(0, 1e3)
        }).start();
      },
      _animOpenBtnPlayAgain: function _animOpenBtnPlayAgain() {
        var action = cc.repeatForever(cc.sequence(cc.scaleBy(1, .9, 1.1), cc.scaleTo(1, 1, 1))).easing(cc.easeBackInOut(.5));
        this.playAgainBtn.runAction(action).easing(cc.easeBackInOut(.5));
      },
      _animScore: function _animScore(scoreGame) {
        var _this2 = this;
        var score = {
          value: 0
        };
        cc.tween(score).to(2, {
          value: scoreGame
        }, {
          progress: function progress(s, e, c, t) {
            var num = Math.round(e * t);
            _this2.labelScore.string = String(num);
          }
        }).start();
      },
      _animAla: function _animAla() {
        var actionScale1 = cc.scaleTo(2, 1.2, 1.2);
        var actionScale2 = cc.scaleTo(2, 1, 1);
        var Action = cc.repeatForever(cc.sequence(actionScale1, actionScale2));
        this.Ala.runAction(Action);
      },
      start: function start() {},
      onClickPlayAgainBtn: function onClickPlayAgainBtn() {
        this._animHidePopup();
        this.boardGame.opacity = 255;
        V.audio.pauseSoundLose();
        V.game.enabled = true;
      }
    });
    cc._RF.pop();
  }, {
    Variables: "Variables",
    mEmitter: "mEmitter"
  } ],
  Variables: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "53c315CYmVAgraEqJPqbzKy", "Variables");
    "use strict";
    var Variables = {
      rows: 4,
      cols: 4,
      numbers: [ 2, 4 ],
      blocks: [],
      data: [],
      positions: [],
      scoreGame: 0,
      scoreExtra: 0,
      bestScoreGame: 0,
      isNoneSound: false,
      isCompleted: true,
      isMoved: false,
      score: null,
      bestScore: null,
      blocksLayout: null,
      block: null,
      audio: null,
      audio1: null,
      game: null,
      userData: {
        score: 0,
        moveStep: 0
      }
    };
    module.exports = Variables;
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  audio: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "30383OlFsZDOo0f0LMTyDQN", "audio");
    "use strict";
    var Emitter = require("mEmitter");
    var Variables = require("Variables");
    cc.Class({
      extends: cc.Component,
      properties: {
        musicBackGround: {
          default: null,
          type: cc.AudioClip
        },
        soundLose: {
          default: null,
          type: cc.AudioClip
        },
        soundWin: {
          default: null,
          type: cc.AudioClip
        },
        soundClick: {
          default: null,
          type: cc.AudioClip
        },
        _isNoneSound: false
      },
      get isNoneSound() {
        return this._isNoneSound;
      },
      set isNoneSound(value) {
        return this._isNoneSound = value;
      },
      onLoad: function onLoad() {
        Emitter.instance.emit("transAudio", this);
      },
      playMusicBackground: function playMusicBackground(loop) {
        this.pauseAll();
        cc.audioEngine.play(this.musicBackGround, loop);
      },
      playSoundLose: function playSoundLose() {
        this.pauseAll();
        cc.audioEngine.play(this.soundLose, false);
      },
      playSoundWin: function playSoundWin() {
        this.pauseAll();
        var soundWin = cc.audioEngine.play(this.soundWin, false);
        return soundWin;
      },
      playSoundClick: function playSoundClick() {
        if (this.isNoneSound) return;
        var soundClick = cc.audioEngine.play(this.soundClick, false);
        return soundClick;
      },
      pauseSoundClick: function pauseSoundClick() {
        cc.audioEngine.stop(this.playSoundClick());
      },
      pauseSoundWin: function pauseSoundWin() {
        cc.audioEngine.stop(this.playSoundWin());
        this.playMusicBackground(false);
      },
      pauseSoundLose: function pauseSoundLose() {
        cc.audioEngine.stop(this.playSoundWin());
        this.playMusicBackground(false);
      },
      pauseAll: function pauseAll() {
        cc.audioEngine.pauseAll();
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    Variables: "Variables",
    mEmitter: "mEmitter"
  } ],
  bestScore: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ac303s7qJNGgbZQ6UpUYXr7", "bestScore");
    "use strict";
    var Emitter = require("mEmitter");
    var V = require("Variables");
    cc.Class({
      extends: cc.Component,
      properties: {
        bestScoreNumber: cc.Label
      },
      onLoad: function onLoad() {
        Emitter.instance.emit("transBestScore", this);
      },
      updateBestScore: function updateBestScore(number) {
        this.bestScoreNumber.string = number;
      },
      saveBestScore: function saveBestScore(userData) {
        cc.sys.localStorage.setItem("userData", JSON.stringify(userData));
      },
      loadBestScore: function loadBestScore() {
        var userData = JSON.parse(cc.sys.localStorage.getItem("userData"));
        if (null == userData) {
          this.saveBestScore(V.userData);
          return;
        }
        this.updateBestScore(userData.score);
        return userData;
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    Variables: "Variables",
    mEmitter: "mEmitter"
  } ],
  block: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "34b8fYIuhBOVbel+3QMMdfw", "block");
    "use strict";
    var Emitter = require("mEmitter");
    var colors = require("colors");
    cc.Class({
      extends: cc.Component,
      properties: {
        labelNum: {
          default: null,
          type: cc.Label
        },
        background: {
          default: null,
          type: cc.Node
        }
      },
      onLoad: function onLoad() {
        Emitter.instance.emit("transBlock", this);
      },
      setLabel: function setLabel(label) {
        this.labelNum.string = 0 == label ? "" : label;
        this.node.color = colors[label];
        return 1;
      },
      appear: function appear() {
        var actions = [ cc.scaleTo(0, 0), cc.scaleTo(.05, 1) ];
        this.node.runAction(cc.sequence(actions));
      },
      merge: function merge() {
        var actions = [ cc.scaleTo(.05, 1.3), cc.scaleTo(.05, 1) ];
        this.node.runAction(cc.sequence(actions));
      }
    });
    cc._RF.pop();
  }, {
    colors: "colors",
    mEmitter: "mEmitter"
  } ],
  board: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "eacb9rmiiNOg5I83YAHp9T6", "board");
    "use strict";
    var ROWS = 4;
    var NUMBERS = [ 2, 4 ];
    var V = require("Variables");
    var Emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        blockPrefab: {
          default: null,
          type: cc.Prefab
        }
      },
      onLoad: function onLoad() {
        Emitter.instance.emit("transBlocksLayout", this);
        Emitter.instance.registerEvent("transAudioSceneWelcomeToMain", this.transAudioSceneWelcomeToMain, this);
      },
      transAudioSceneWelcomeToMain: function transAudioSceneWelcomeToMain(data) {},
      start: function start() {
        this.createBlocksLayout();
        this.gameInit();
      },
      countScore: function countScore() {
        if (0 == V.scoreExtra) return;
        V.scoreGame += V.scoreExtra;
        var userData = new Object();
        userData.score = V.scoreGame;
        userData.moveStep = 10;
        var bestScore = V.bestScore.loadBestScore();
        if (userData.score > bestScore.score) {
          V.bestScore.saveBestScore(userData);
          V.bestScore.loadBestScore();
        }
        V.score.updateExtraScore(V.scoreExtra);
        V.score.updateScore(V.scoreGame);
        V.scoreExtra = 0;
      },
      createdBlock: function createdBlock(width, height, x, y, label) {
        var block = cc.instantiate(this.blockPrefab);
        block.width = width;
        block.height = height;
        block.parent = this.node;
        block.setPosition(cc.v2(x, y));
        block.getComponent("block").setLabel(label);
        block.getComponent("block").appear();
        return block;
      },
      createBlocksLayout: function createBlocksLayout() {
        var y = 250;
        var distance = 20;
        var size = 150;
        for (var row = 0; row < 4; row++) {
          V.positions.push([ 0, 0, 0, 0 ]);
          var x = -250;
          for (var col = 0; col < V.cols; col++) {
            this.createdBlock(size, size, x, y, 0);
            V.positions[row][col] = cc.v2(x, y);
            x += distance + size;
          }
          y -= distance + size;
        }
      },
      getEmptyLocations: function getEmptyLocations() {
        var emptyLocations = [];
        for (var row = 0; row < 4; row++) for (var col = 0; col < 4; col++) null == V.blocks[row][col] && emptyLocations.push({
          x: row,
          y: col
        });
        return emptyLocations;
      },
      createArray2D: function createArray2D(row, col, value) {
        var arr = new Array();
        for (var i = 0; i < row; i++) {
          arr[i] = new Array();
          for (var j = 0; j < col; j++) arr[i][j] = value;
        }
        return arr;
      },
      gameInit: function gameInit() {
        V.scoreExtra = 0;
        V.scoreGame = 0;
        V.isCompleted = true;
        V.score.updateScore(V.scoreGame);
        V.blocks = this.createArray2D(4, 4, null);
        V.data = this.createArray2D(4, 4, 0);
        this.randomBlock();
        this.randomBlock();
      },
      randomBlock: function randomBlock() {
        var emptyLocations = this.getEmptyLocations();
        if (emptyLocations.length > 0) {
          var locationRandom = emptyLocations[Math.floor(Math.random() * emptyLocations.length)];
          var x = locationRandom.x;
          var y = locationRandom.y;
          var size = 150;
          var numberRandom = V.numbers[Math.floor(Math.random() * V.numbers.length)];
          var block = this.createdBlock(size, size, V.positions[x][y].x, V.positions[x][y].y, numberRandom);
          V.blocks[x][y] = block;
          V.data[x][y] = numberRandom;
          block.getComponent("block").appear();
          emptyLocations = this.getEmptyLocations();
          if (0 == emptyLocations.length && this.checkLose()) {
            Emitter.instance.emit("showPopupLoseGame", V.scoreGame);
            Emitter.instance.emit("onDisableKeyDownLoseGame");
          }
        }
      },
      afterMove: function afterMove() {
        var _this = this;
        if (false == V.isMoved) {
          V.isCompleted = true;
          return;
        }
        var actions = [ cc.callFunc(function() {
          _this.countScore();
        }), cc.callFunc(function() {
          _this.randomBlock();
        }), cc.callFunc(function() {
          if (_this.checkWin()) {
            Emitter.instance.emit("showPopupWinGame", V.scoreGame);
            Emitter.instance.emit("onDisabledKeyDown");
          }
        }), cc.callFunc(function() {
          V.isCompleted = true;
        }) ];
        this.node.runAction(cc.sequence(actions));
      },
      moveNode: function moveNode(block, position, callback) {
        var actions = [ cc.moveTo(.05, position), cc.callFunc(function() {
          V.isMoved = true;
        }), cc.callFunc(function() {
          callback();
        }) ];
        block.runAction(cc.sequence(actions));
      },
      mergeNode: function mergeNode(block, blockTarget, label, callback) {
        block.destroy();
        var actions = [ cc.callFunc(function() {
          blockTarget.getComponent("block").setLabel(label);
        }), cc.callFunc(function() {
          blockTarget.getComponent("block").merge();
        }), cc.callFunc(function() {
          V.isMoved = true;
        }), cc.callFunc(function() {
          callback();
        }) ];
        blockTarget.runAction(cc.sequence(actions));
      },
      moveLeft: function moveLeft(row, col, callback) {
        var _this2 = this;
        if (0 == col || 0 == V.data[row][col]) {
          callback();
          return;
        }
        if (0 == V.data[row][col - 1]) {
          var block = V.blocks[row][col];
          var position = V.positions[row][col - 1];
          V.blocks[row][col - 1] = block;
          V.data[row][col - 1] = V.data[row][col];
          V.data[row][col] = 0;
          V.blocks[row][col] = null;
          this.moveNode(block, position, function() {
            V.isMoved = true;
            _this2.moveLeft(row, col - 1, callback);
          });
        } else {
          if (V.data[row][col - 1] != V.data[row][col]) {
            callback();
            return;
          }
          var _block = V.blocks[row][col];
          var _position = V.positions[row][col - 1];
          V.data[row][col - 1] *= 2;
          V.scoreExtra += V.data[row][col - 1];
          V.data[row][col] = 0;
          V.blocks[row][col] = null;
          this.moveNode(_block, _position, function() {
            _this2.mergeNode(_block, V.blocks[row][col - 1], V.data[row][col - 1], function() {
              V.isMoved = true;
              callback();
            });
          });
        }
      },
      moveRight: function moveRight(row, col, callback) {
        var _this3 = this;
        if (col == V.rows - 1 || 0 == V.data[row][col]) {
          callback();
          return;
        }
        if (0 == V.data[row][col + 1]) {
          var block = V.blocks[row][col];
          var position = V.positions[row][col + 1];
          V.blocks[row][col + 1] = block;
          V.data[row][col + 1] = V.data[row][col];
          V.data[row][col] = 0;
          V.blocks[row][col] = null;
          this.moveNode(block, position, function() {
            V.isMoved = true;
            _this3.moveRight(row, col + 1, callback);
          });
        } else {
          if (V.data[row][col + 1] != V.data[row][col]) {
            callback();
            return;
          }
          var _block2 = V.blocks[row][col];
          var _position2 = V.positions[row][col + 1];
          V.data[row][col + 1] *= 2;
          V.scoreExtra += V.data[row][col + 1];
          V.data[row][col] = 0;
          V.blocks[row][col] = null;
          this.moveNode(_block2, _position2, function() {
            _this3.mergeNode(_block2, V.blocks[row][col + 1], V.data[row][col + 1], function() {
              V.isMoved = true;
              callback();
            });
          });
        }
      },
      inputRight: function inputRight() {
        var _this4 = this;
        var getNodeToMove = [];
        for (var row = 0; row < V.rows; row++) for (var col = V.rows - 1; col >= 0; col--) 0 != V.data[row][col] && getNodeToMove.push({
          x: row,
          y: col
        });
        var counter = 0;
        for (var i = 0; i < getNodeToMove.length; ++i) this.moveRight(getNodeToMove[i].x, getNodeToMove[i].y, function() {
          counter++;
          _this4.checkCounter(counter, getNodeToMove);
        });
      },
      inputLeft: function inputLeft() {
        var _this5 = this;
        var getNodeToMove = [];
        for (var row = 0; row < V.rows; ++row) for (var col = 0; col < V.rows; ++col) 0 != V.data[row][col] && getNodeToMove.push({
          x: row,
          y: col
        });
        var counter = 0;
        for (var i = 0; i < getNodeToMove.length; ++i) this.moveLeft(getNodeToMove[i].x, getNodeToMove[i].y, function() {
          counter++;
          _this5.checkCounter(counter, getNodeToMove);
        });
      },
      moveUp: function moveUp(row, col, callback) {
        var _this6 = this;
        if (0 == row || 0 == V.data[row][col]) {
          callback();
          return;
        }
        if (0 == V.data[row - 1][col]) {
          var block = V.blocks[row][col];
          var position = V.positions[row - 1][col];
          V.blocks[row - 1][col] = block;
          V.data[row - 1][col] = V.data[row][col];
          V.data[row][col] = 0;
          V.blocks[row][col] = null;
          this.moveNode(block, position, function() {
            V.isMoved = true;
            _this6.moveUp(row - 1, col, callback);
          });
        } else {
          if (V.data[row - 1][col] != V.data[row][col]) {
            callback();
            return;
          }
          var _block3 = V.blocks[row][col];
          var _position3 = V.positions[row - 1][col];
          V.data[row - 1][col] *= 2;
          V.scoreExtra += V.data[row - 1][col];
          V.data[row][col] = 0;
          V.blocks[row][col] = null;
          this.moveNode(_block3, _position3, function() {
            _this6.mergeNode(_block3, V.blocks[row - 1][col], V.data[row - 1][col], function() {
              V.isMoved = true;
              callback();
            });
          });
        }
      },
      inputUp: function inputUp() {
        var _this7 = this;
        var getNodeToMove = [];
        for (var row = 0; row < V.rows; row++) for (var col = 0; col < V.rows; col++) 0 != V.data[row][col] && getNodeToMove.push({
          x: row,
          y: col
        });
        var counter = 0;
        for (var i = 0; i < getNodeToMove.length; ++i) this.moveUp(getNodeToMove[i].x, getNodeToMove[i].y, function() {
          counter++;
          _this7.checkCounter(counter, getNodeToMove);
        });
      },
      moveDown: function moveDown(row, col, callback) {
        var _this8 = this;
        if (row == V.rows - 1 || 0 == V.data[row][col]) {
          callback();
          return;
        }
        if (0 == V.data[row + 1][col]) {
          var block = V.blocks[row][col];
          var position = V.positions[row + 1][col];
          V.blocks[row + 1][col] = block;
          V.data[row + 1][col] = V.data[row][col];
          V.data[row][col] = 0;
          V.blocks[row][col] = null;
          this.moveNode(block, position, function() {
            V.isMoved = true;
            _this8.moveDown(row + 1, col, callback);
          });
        } else {
          if (V.data[row + 1][col] != V.data[row][col]) {
            callback();
            return;
          }
          var _block4 = V.blocks[row][col];
          var _position4 = V.positions[row + 1][col];
          V.data[row + 1][col] *= 2;
          V.scoreExtra += V.data[row + 1][col];
          V.data[row][col] = 0;
          V.blocks[row][col] = null;
          this.moveNode(_block4, _position4, function() {
            _this8.mergeNode(_block4, V.blocks[row + 1][col], V.data[row + 1][col], function() {
              V.isMoved = true;
              callback();
            });
          });
        }
      },
      inputDown: function inputDown() {
        var _this9 = this;
        var getNodeToMove = [];
        for (var row = V.rows - 1; row >= 0; row--) for (var col = 0; col < V.rows; col++) 0 != V.data[row][col] && getNodeToMove.push({
          x: row,
          y: col
        });
        var counter = 0;
        for (var i = 0; i < getNodeToMove.length; i++) this.moveDown(getNodeToMove[i].x, getNodeToMove[i].y, function() {
          counter++;
          _this9.checkCounter(counter, getNodeToMove);
        });
      },
      checkCounter: function checkCounter(counter, getNodeToMove) {
        counter == getNodeToMove.length && this.afterMove();
      },
      newGame: function newGame() {
        for (var row = 0; row < 4; row++) for (var col = 0; col < 4; col++) null != V.blocks[row][col] && V.blocks[row][col].destroy();
        this.gameInit();
        Emitter.instance.emit("onEnableKeyDown");
        V.audio1.playSoundClick();
      },
      checkWin: function checkWin() {
        for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) if (2048 == V.data[i][j]) return true;
        return false;
      },
      checkLose: function checkLose() {
        for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) if (3 == i && j < 3) {
          if (V.data[i][j] == V.data[i][j + 1]) return false;
        } else if (3 == j) {
          if (i < 3 && V.data[i][j] == V.data[i + 1][j]) return false;
        } else if (V.data[i][j] == V.data[i + 1][j] || V.data[i][j] == V.data[i][j + 1]) return false;
        return true;
      }
    });
    cc._RF.pop();
  }, {
    Variables: "Variables",
    mEmitter: "mEmitter"
  } ],
  colors: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a6b59/ai4dHFJwInlj5Eg62", "colors");
    "use strict";
    var colors = {
      0: cc.color(205, 193, 179, 255),
      2: cc.color(19, 123, 192, 255),
      4: cc.color(53, 7, 172, 255),
      8: cc.color(240, 167, 110, 255),
      16: cc.color(244, 138, 89, 255),
      32: cc.color(245, 112, 85, 255),
      64: cc.color(245, 83, 52, 255),
      128: cc.color(234, 200, 103, 255),
      256: cc.color(234, 197, 87, 255),
      512: cc.color(234, 192, 71, 255),
      1024: cc.color(146, 208, 80, 255),
      2048: cc.color(0, 176, 240, 255)
    };
    module.exports = colors;
    cc._RF.pop();
  }, {} ],
  game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "59911lEJEtPNLpcVcx2XlqX", "game");
    "use strict";
    var V = require("Variables");
    var Emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        btnNewGame: cc.Button
      },
      onLoad: function onLoad() {
        Emitter.instance.registerEvent("transBlocksLayout", this.transBlocksLayout, this);
        Emitter.instance.registerEvent("transBlock", this.transBlock, this);
        Emitter.instance.registerEvent("transScore", this.transScore, this);
        Emitter.instance.registerEvent("transBestScore", this.transBestScore, this);
        Emitter.instance.registerEvent("transAudio", this.transAudio, this);
        Emitter.instance.registerEvent("onEnableKeyDown", this.initEvent.bind(this));
        Emitter.instance.registerEvent("onDisabledKeyDown", this.onDisabledKeyDown.bind(this));
        Emitter.instance.registerEvent("onDisableKeyDownLoseGame", this.onDisabledKeyDown.bind(this));
        V.game = this.btnNewGame;
        this.initEvent();
      },
      init: function init() {
        V.bestScore.loadBestScore();
      },
      initEvent: function initEvent() {
        var _this = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.node.on("touchstart", function(event) {
          _this.startPoint = event.getLocation();
        });
        this.node.on("touchend", function(event) {
          _this.TouchEnd(event);
        });
      },
      transAudio: function transAudio(data) {
        V.audio1 = data;
        V.audio1.isNoneSound = V.isNoneSound;
      },
      transBestScore: function transBestScore(data) {
        V.bestScore = data;
      },
      transBlocksLayout: function transBlocksLayout(data) {
        V.blocksLayout = data;
      },
      transBlock: function transBlock(data) {
        V.block = data;
      },
      transScore: function transScore(data) {
        V.score = data;
      },
      TouchEnd: function TouchEnd(event) {
        this.endPoint = event.getLocation();
        var subVector = this.endPoint.sub(this.startPoint);
        var delta = subVector.mag();
        if (true != V.isCompleted) return;
        if (delta > 50) if (Math.abs(subVector.x) > Math.abs(subVector.y)) if (subVector.x > 0) {
          V.isCompleted = false;
          V.audio1.playSoundClick();
          V.blocksLayout.inputRight();
          V.isMoved = false;
        } else {
          V.isCompleted = false;
          V.audio1.playSoundClick();
          V.blocksLayout.inputLeft();
          V.isMoved = false;
        } else if (subVector.y > 0) {
          V.isCompleted = false;
          cc.log("up");
          V.audio1.playSoundClick();
          V.blocksLayout.inputUp();
          V.isMoved = false;
        } else {
          V.isCompleted = false;
          V.audio1.playSoundClick();
          V.blocksLayout.inputDown();
          V.isMoved = false;
        }
      },
      onKeyDown: function onKeyDown(event) {
        if (false == V.isCompleted) {
          console.log("not Completed");
          return;
        }
        V.isCompleted = false;
        switch (event.keyCode) {
         case cc.macro.KEY.down:
          V.audio1.playSoundClick();
          V.blocksLayout.inputDown();
          V.isMoved = false;
          break;

         case cc.macro.KEY.up:
          V.audio1.playSoundClick();
          V.blocksLayout.inputUp();
          V.isMoved = false;
          break;

         case cc.macro.KEY.left:
          V.audio1.playSoundClick();
          V.blocksLayout.inputLeft();
          V.isMoved = false;
          break;

         case cc.macro.KEY.right:
          V.audio1.playSoundClick();
          V.blocksLayout.inputRight();
          V.isMoved = false;
          break;

         default:
          V.isCompleted = true;
          return;
        }
      },
      onDisabledKeyDown: function onDisabledKeyDown() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.node.off("touchstart");
        this.node.off("touchend");
      },
      start: function start() {
        V.bestScore.loadBestScore();
      },
      update: function update(dt) {}
    });
    cc._RF.pop();
  }, {
    Variables: "Variables",
    mEmitter: "mEmitter"
  } ],
  mEmitter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "13a4d9O26VMwodN2yJsPgGZ", "mEmitter");
    "use strict";
    var _createClass = function() {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          "value" in descriptor && (descriptor.writable = true);
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        protoProps && defineProperties(Constructor.prototype, protoProps);
        staticProps && defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    var EventEmitter = require("events");
    var mEmitter = function() {
      function mEmitter() {
        _classCallCheck(this, mEmitter);
        this._emiter = new EventEmitter();
        this._emiter.setMaxListeners(100);
      }
      _createClass(mEmitter, [ {
        key: "emit",
        value: function emit() {
          var _emiter;
          (_emiter = this._emiter).emit.apply(_emiter, arguments);
        }
      }, {
        key: "registerEvent",
        value: function registerEvent(event, listener) {
          this._emiter.on(event, listener);
        }
      }, {
        key: "registerOnce",
        value: function registerOnce(event, listener) {
          this._emiter.once(event, listener);
        }
      }, {
        key: "removeEvent",
        value: function removeEvent(event, listener) {
          this._emiter.removeListener(event, listener);
        }
      }, {
        key: "destroy",
        value: function destroy() {
          this._emiter.removeAllListeners();
          this._emiter = null;
          mEmitter.instance = null;
        }
      } ]);
      return mEmitter;
    }();
    mEmitter.instance = null;
    module.exports = mEmitter;
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {
    events: 1
  } ],
  popup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fe97b87LJ9Mkrk6rTulrKMn", "popup");
    "use strict";
    var Emitter = require("mEmitter");
    var V = require("Variables");
    cc.Class({
      extends: cc.Component,
      properties: {
        playAgainBtn: cc.Node,
        labelScore: cc.Label,
        particle: cc.Node,
        boardGame: cc.Node
      },
      onLoad: function onLoad() {
        Emitter.instance.registerEvent("showPopupWinGame", this._animOpenPopup.bind(this));
        this.node.y = 1100;
        this.node.active = false;
      },
      _animOpenPopup: function _animOpenPopup(scoreGame) {
        var _this = this;
        V.audio.playSoundWin();
        this.node.active = true;
        this.particle.active = false;
        cc.tween(this.boardGame).to(.5, {
          opacity: 50
        }).start();
        cc.tween(this.node).to(1, {
          position: cc.v2(0, 0)
        }, {
          easing: "backInOut"
        }).call(function() {
          _this._animOpenBtnPlayAgain();
          _this.labelScore.string = 0;
          _this._animScore(scoreGame);
        }).start();
      },
      _animationBtn: function _animationBtn() {},
      _animHidePopup: function _animHidePopup() {
        cc.tween(this.boardGame).to(.5, {
          opacity: 255
        }).start();
        cc.tween(this.node).to(1, {
          position: cc.v2(0, 1e3)
        }).start();
      },
      _animOpenBtnPlayAgain: function _animOpenBtnPlayAgain() {
        var action = cc.repeatForever(cc.sequence(cc.scaleBy(1, .9, 1.1), cc.scaleTo(1, 1, 1))).easing(cc.easeBackInOut(.5));
        this.playAgainBtn.runAction(action).easing(cc.easeBackInOut(.5));
      },
      _animScore: function _animScore(scoreGame) {
        var _this2 = this;
        var score = {
          value: 0
        };
        cc.tween(score).to(2, {
          value: scoreGame
        }, {
          progress: function progress(s, e, c, t) {
            var num = Math.round(e * t);
            _this2.labelScore.string = String(num);
          }
        }).call(function() {
          _this2.particle.active = true;
        }).start();
      },
      start: function start() {},
      onClickPlayAgainBtn: function onClickPlayAgainBtn() {
        this.node.active = false;
        this._animHidePopup();
        this.particle.active = false;
        this.boardGame.opacity = 255;
        V.audio.pauseSoundWin();
      }
    });
    cc._RF.pop();
  }, {
    Variables: "Variables",
    mEmitter: "mEmitter"
  } ],
  score: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "43036c9A1VAnK4eP1MQguIb", "score");
    "use strict";
    var V = require("Variables");
    var Emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        scoreNumber: cc.Label,
        scoreExtra: cc.Label,
        score: 0
      },
      onLoad: function onLoad() {},
      start: function start() {
        Emitter.instance.emit("transScore", this);
        this.scoreExtra.node.active = false;
      },
      updateExtraScore: function updateExtraScore(number) {
        var _this = this;
        var duration = .5;
        if (0 == number) return;
        this.scoreExtra.node.active = true;
        this.scoreExtra.string = "+ " + number;
        var actions = [ cc.moveTo(0, 0, 0), cc.moveTo(duration, 0, 20), cc.moveTo(0, 0, -20), cc.callFunc(function() {
          _this.scoreExtra.node.active = false;
        }), this.scoreExtra.node.stopAllActions() ];
        this.scoreExtra.node.runAction(cc.sequence(actions));
      },
      updateScore: function updateScore(number) {
        this.scoreNumber.string = number;
      }
    });
    cc._RF.pop();
  }, {
    Variables: "Variables",
    mEmitter: "mEmitter"
  } ],
  setting: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3e370K5sXlBeps6fYQ66z/F", "setting");
    "use strict";
    var V = require("Variables");
    var Emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        mainMenu: cc.Node,
        noneSound: cc.Node,
        noneMusic: cc.Node,
        playBtn: cc.Node,
        _isNoneSound: false,
        _isNoneMusic: false,
        _isClick: false
      },
      get isClick() {
        return this._isClick;
      },
      set isClick(value) {
        return this._isClick = value;
      },
      onLoad: function onLoad() {
        this.isClick = false;
        this.node.y = 1e3;
        this.node.active = false;
        this.noneSound.active = this._isNoneSound;
        this.noneMusic.active = this._isNoneMusic;
      },
      start: function start() {},
      onClickBtn: function onClickBtn() {
        console.log(this.isClick);
        if (this.isClick) {
          console.log("destroy");
          return;
        }
        this.isClick = false;
        console.log("open");
        this.openPopup();
      },
      onClickBtnClose: function onClickBtnClose() {
        if (true == this.isClick) {
          V.audio.playSoundClick();
          this.hidePopup();
          this.isClick = false;
        }
      },
      openPopup: function openPopup() {
        if (this.isClick) return;
        V.audio.playSoundClick();
        this.isClick = true;
        this.node.active = true;
        this.playBtn.active = false;
        cc.tween(this.mainMenu).to(.5, {
          opacity: 20
        }).start();
        cc.tween(this.node).to(1, {
          position: cc.v2(0, 0)
        }, {
          easing: "backInOut"
        }).start();
      },
      hidePopup: function hidePopup() {
        this.playBtn.active = true;
        cc.tween(this.mainMenu).to(.5, {
          opacity: 255
        }).start();
        cc.tween(this.node).to(1, {
          position: cc.v2(0, 1e3)
        }).start();
      },
      onClickSound: function onClickSound() {
        this.isNoneSound = !this.isNoneSound;
        if (this.isNoneSound) {
          V.audio.pauseSoundClick();
          V.audio.isNoneSound = true;
          V.isNoneSound = V.audio.isNoneSound;
        } else {
          V.audio.isNoneSound = false;
          V.isNoneSound = V.audio.isNoneSound;
          V.audio.playSoundClick();
        }
        this.noneSound.active = this.isNoneSound;
      },
      onClickMusic: function onClickMusic() {
        this.isNoneMusic = !this.isNoneMusic;
        this.isNoneMusic ? V.audio.pauseAll() : V.audio.playMusicBackground();
        this.noneMusic.active = this.isNoneMusic;
      }
    });
    cc._RF.pop();
  }, {
    Variables: "Variables",
    mEmitter: "mEmitter"
  } ],
  welcome: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "280c3rsZJJKnZ9RqbALVwtK", "welcome");
    "use strict";
    var V = require("Variables");
    var Emitter = require("mEmitter");
    cc.Class({
      extends: cc.Component,
      properties: {
        label: {
          default: null,
          type: cc.Label
        },
        _text: "2048",
        _isClick: false,
        mainMenu: cc.Node,
        btnPlay: cc.Node,
        btnSetting: cc.Node,
        cloud1: cc.Node,
        cloud2: cc.Node,
        logo: cc.Node
      },
      get isClick() {
        return this._isClick;
      },
      set isClick(value) {
        return this._isClick = value;
      },
      onLoad: function onLoad() {
        var _this = this;
        this.isClick = false;
        this.label.string = this._text;
        this.label.fontSize = 200;
        this.mainMenu.active = false;
        cc.tween(this.label.node).to(2, {
          opacity: 0
        }).call(function() {
          _this._initMainScreen();
        }).call(function() {
          V.audio.playMusicBackground(true);
        }).start();
        Emitter.instance = new Emitter();
        Emitter.instance.registerEvent("transAudio", this.transAudio, this);
      },
      transAudio: function transAudio(data) {
        V.audio = data;
      },
      _initMainScreen: function _initMainScreen() {
        this.mainMenu.active = true;
        this.btnPlay.runAction(this._animationBtn());
        this.btnSetting.runAction(this._animationBtn());
        this.cloud1.runAction(this._animationCloud());
        this.cloud2.runAction(this._animationCloud());
        this.logo.runAction(this._animLogo());
      },
      _animationBtn: function _animationBtn() {
        return this.anim = cc.repeatForever(cc.sequence(cc.scaleBy(1, .9, 1.1), cc.scaleTo(1, 1, 1))).easing(cc.easeBackInOut(.5));
      },
      _animationCloud: function _animationCloud() {
        return this.anim2 = cc.repeatForever(cc.sequence(cc.moveBy(1, cc.v2(-15, 0)), cc.moveBy(1, cc.v2(15, 0)))).easing(cc.easeBackInOut(.5));
      },
      _animLogo: function _animLogo() {
        return this.anim3 = cc.rotateTo(5, 0).easing(cc.easeBackInOut(.5));
      },
      onClickBtnPlay: function onClickBtnPlay() {
        if (false == this.isClick) {
          console.log(V.isNoneSound);
          V.audio.playSoundClick();
          Emitter.instance.emit("transAudioSceneWelcomeToMain", V.audio.isNoneSound);
          cc.director.loadScene("Main");
          this.isClick = true;
        }
        return;
      }
    });
    cc._RF.pop();
  }, {
    Variables: "Variables",
    mEmitter: "mEmitter"
  } ]
}, {}, [ "BocksLayout", "Game", "LoseGame", "Variables", "audio", "bestScore", "block", "board", "colors", "game", "mEmitter", "popup", "score", "setting", "welcome" ]);