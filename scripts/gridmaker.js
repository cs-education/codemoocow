// Generated by CoffeeScript 1.6.2
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.GameVisual = (function() {
    var ar, charObj, frameClock, frameLength, imgArray, ldingLyr, lyr1, lyr2, objArray, ticker;

    ticker = 0;

    imgArray = [];

    objArray = [];

    frameClock = null;

    lyr1 = null;

    lyr2 = null;

    ldingLyr = null;

    frameLength = 17;

    ar = null;

    /*
    	#gameVisual constructor accepts a master configuration and ms.  The configuration object will primarily contain image pathing information so the images
    	#can be preloaded.  The int will determine the length of time before a new frame is drawn and swapped, optimal values seem to reside in 15-17 milliseconds
    */


    function GameVisual(config, fl) {
      this.startGame = __bind(this.startGame, this);
      this.coffeederp = __bind(this.coffeederp, this);      frameLength = fl;
      this.initContainer(config.container.width, config.container.height, config.container.id);
      this.initResources(config.preLoading);
      return;
    }

    /*
    	#initContainer accepts a width, height, and a div ID.  The div is formatted to the width and height given and two canvas elements are created.
    	#These canvas elements are stacked ontop of eachother in the div.  Need to resolve the issue concerning a loading screen.
    */


    GameVisual.prototype.initContainer = function(w, h, d) {
      var obj;

      obj = $("#" + d);
      obj.width(w);
      obj.height(h);
      lyr1 = document.createElement("canvas");
      lyr2 = document.createElement("canvas");
      obj.prepend(lyr1);
      $(lyr1).text("Your browser does not support Canvas");
      $(lyr1).css("position", "absolute");
      $(lyr1).attr("width", w);
      $(lyr1).attr("height", h);
      $(lyr1).css("z-index", "3");
      obj.prepend(lyr2);
      $(lyr2).text("Your browser does not support Canvas");
      $(lyr2).css("position", "absolute");
      $(lyr2).attr("width", w);
      $(lyr2).attr("height", h);
      $(lyr2).css("z-index", "2");
    };

    /*
    	#initResources is hard coded at the moment but will eventually take parsed information from the master config file and then use it to
    	#preload all the necessary images.  Sounds will eventually be included in here as well.
    */


    GameVisual.prototype.initResources = function(config) {
      var fi, imgar, imgo, key, tmp, _i, _len;

      tmp = [];
      for (key in config) {
        imgar = config[key];
        for (_i = 0, _len = imgar.length; _i < _len; _i++) {
          fi = imgar[_i];
          imgo = new Image();
          imgo.src = fi;
          tmp[tmp.length] = imgo;
        }
        imgArray[imgArray.length] = tmp;
      }
    };

    GameVisual.prototype.coffeederp = function(config) {
      var _this = this;

      return function() {
        if (ticker === 2 * config.animation.length) {
          ticker = 0;
        }
        ticker++;
        return _this.getFrame(config);
      };
    };

    /*
    	#startGame is hard coded at the moment but will eventually take parsed information from a sub config file and then use it
    	#to determine the nature of the game to be played.  Will initialize array of objects, determine objectives and start the game clock
    */


    GameVisual.prototype.startGame = function(config) {
      var key, set, tmp, _ref;

      ar = config.animation.length;
      _ref = config.characters;
      for (key in _ref) {
        set = _ref[key];
        tmp = new charObj(imgArray[set.imgSet], 1, config.grid.border + (config.grid.gridUnit * set.x), config.grid.border + (config.grid.gridUnit * set.y), set.xOff, set.yOff, set.xSize, set.ySize);
        objArray[objArray.length] = tmp;
      }
      frameClock = setInterval(this.coffeederp(config), frameLength);
    };

    /*
    	#charFace accepts an index and a direction.  The index will be equivalent to a character id and will reference the character object inside the
    	#objArray member for which to alter the direction of
    */


    GameVisual.prototype.charFace = function(char, direction) {
      objArray[char].dirFace(direction);
    };

    /*
    	#gridMove accepts an index and a distance.  For the given character, gridMove will add dist number of move commands to that characters move queue in
    	#the direction that they were facing at the time the function is run
    */


    GameVisual.prototype.gridMove = function(char, dist) {
      var i, _i;

      for (i = _i = 1; _i <= dist; i = _i += 1) {
        objArray[char].newMove(objArray[char].dir);
      }
    };

    /*
    	#pixMove accepts a character index and an x and y coordinate referencing pixels.  This is a more powerful function than gridMove allowing for freer movement
    	#for potential use in other gametypes.  NOT YET IMPLEMENTED
    */


    GameVisual.prototype.pixMove = function(char, x, y) {};

    GameVisual.prototype.changeState = function(char, state) {};

    /*
    	#charObj is a class representing the characters that can move around the canvas.  It keeps track of the direction the character is facing,
    	#the x and y coordinate in pixels, an array of the image objects pertaining to the character, the appropriate image for different frames,
    	#and a queue of directions, each of which is eaten and interpreted as a singular move in the direction as follows, where 4 is stationary
    	#       ^
    	#       0
    	#   < 3 4 1 >
    	#       2
    	#       v
    	#More documenation to be added when the code is more concrete and permanent
    */


    charObj = (function() {
      var queue, state;

      queue = [4];

      state = 0;

      function charObj(animarray, dir, xpos, ypos, xOff, yOff, xSize, ySize) {
        this.animarray = animarray;
        this.dir = dir;
        this.xpos = xpos;
        this.ypos = ypos;
        this.xOff = xOff;
        this.yOff = yOff;
        this.xSize = xSize;
        this.ySize = ySize;
      }

      charObj.prototype.current = function(anticker) {
        var num;

        num = 0;
        if ((anticker % (2 * ar)) >= ar) {
          num = 1;
        }
        num = num + (2 * this.dir);
        return this.animarray[num];
      };

      charObj.prototype.dirFace = function(dir) {
        this.dir = dir;
      };

      charObj.prototype.newMove = function(d) {
        queue[queue.length] = d;
      };

      charObj.prototype.moveDir = function(n) {
        return queue[n];
      };

      charObj.prototype.ppo = function() {
        if (queue.length === 1) {
          return queue.splice(0, 1, 4);
        } else {
          return queue.splice(0, 1);
        }
      };

      return charObj;

    })();

    GameVisual.prototype.getFrame = function(config) {
      this.chckMv(config);
      if ($(lyr1).css("z-index") === "3") {
        this.drawFrame(lyr2, config);
        this.swapFrames(lyr2, lyr1);
      } else {
        this.drawFrame(lyr1, config);
        this.swapFrames(lyr1, lyr2);
      }
    };

    GameVisual.prototype.drawFrame = function(frame, config) {
      this.drawGrid(frame, config.grid);
      this.drawChar(frame);
    };

    GameVisual.prototype.drawChar = function(frame) {
      var img, obj, td, _i, _len;

      td = frame.getContext('2d');
      for (_i = 0, _len = objArray.length; _i < _len; _i++) {
        obj = objArray[_i];
        img = obj.current(ticker);
        td.drawImage(img, obj.xpos + obj.xOff, obj.ypos + obj.yOff, obj.xSize, obj.ySize);
      }
    };

    GameVisual.prototype.chckMv = function(config) {
      var obj, _i, _len;

      for (_i = 0, _len = objArray.length; _i < _len; _i++) {
        obj = objArray[_i];
        if (obj.moveDir(0) === 0) {
          obj.dirFace(0);
          obj.ypos = obj.ypos - config.animation.pixMoveRate;
        }
        if (obj.moveDir(0) === 1) {
          obj.dirFace(1);
          obj.xpos = obj.xpos + config.animation.pixMoveRate;
        }
        if (obj.moveDir(0) === 2) {
          obj.dirFace(2);
          obj.ypos = obj.ypos + config.animation.pixMoveRate;
        }
        if (obj.moveDir(0) === 3) {
          obj.dirFace(3);
          obj.xpos = obj.xpos - config.animation.pixMoveRate;
        }
      }
      if (ticker % (config.grid.gridUnit / config.animation.pixMoveRate) === 0) {
        return obj.ppo();
      }
    };

    GameVisual.prototype.swapFrames = function(f1, f2) {
      $(f1).css("z-index", "3");
      $(f2).css("z-index", "2");
    };

    /*
    */


    GameVisual.prototype.drawGrid = function(tmp, config) {
      var grid, ps, _i, _j, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;

      grid = tmp.getContext("2d");
      grid.fillStyle = "#FFFFFF";
      grid.fillRect(0, 0, 1000, 1000);
      grid.beginPath();
      for (ps = _i = _ref = config.border, _ref1 = config.gridUnit * (config.gridX + 1), _ref2 = config.gridUnit; _ref2 > 0 ? _i <= _ref1 : _i >= _ref1; ps = _i += _ref2) {
        this.drawVLine(ps, grid, config.border, config.gridUnit, config.gridX);
      }
      for (ps = _j = _ref3 = config.border, _ref4 = config.gridUnit * (config.gridY + 1), _ref5 = config.gridUnit; _ref5 > 0 ? _j <= _ref4 : _j >= _ref4; ps = _j += _ref5) {
        this.drawHLine(ps, grid, config.border, config.gridUnit, config.gridY);
      }
      grid.strokeStyle = "black";
      grid.stroke();
    };

    /*
    	#drawVLine and drawHLine accept a position, a canvas object, and a maximum dimension
    	#they mark vertical and horizontal lines respectively for the grid stroke in gridMake
    */


    GameVisual.prototype.drawVLine = function(pos, obj, border, gridUnit, gridX) {
      obj.moveTo(pos, border);
      obj.lineTo(pos, border + (gridUnit * gridX));
    };

    GameVisual.prototype.drawHLine = function(pos, obj, border, gridUnit, gridY) {
      obj.moveTo(border, pos);
      obj.lineTo(border + (gridUnit * gridY), pos);
    };

    return GameVisual;

  })();

}).call(this);

/*
//@ sourceMappingURL=gridmaker.map
*/
