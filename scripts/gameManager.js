// Generated by CoffeeScript 1.6.2
(function() {
  var MapGameCommands, MapGameState, debugging, deepcopy, log,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  debugging = true;

  log = function(mesg) {
    if (debugging) {
      return console.log(mesg);
    }
  };

  if (typeof deepcopy === "undefined" || deepcopy === null) {
    deepcopy = function(src) {
      return $.extend(true, {}, src);
    };
  }

  window.GameManager = (function() {
    function GameManager(environment) {
      this.environment = environment;
      this.helpTips = __bind(this.helpTips, this);
      this.runStudentCode = __bind(this.runStudentCode, this);
      this.reset = __bind(this.reset, this);
      this.commandsValid = __bind(this.commandsValid, this);
      this.startGame = __bind(this.startGame, this);
      this.gameName = __bind(this.gameName, this);
      this.config = deepcopy(this.environment.description);
      this.editorDiv = 'codeEditor';
      this.visualDiv = 'gameVisual';
      this.setUpGame();
    }

    GameManager.prototype.setUpGame = function() {
      /*
          Sets up everything for the game to run.
      */

      var editdiv, vis;

      this.gameDiv = jQuery(this.environment.gamediv);
      this.gameDiv.empty();
      editdiv = document.createElement("div");
      vis = document.createElement("div");
      $(editdiv).attr({
        'id': this.editorDiv,
        'class': 'code_editor'
      });
      $(editdiv).css({
        width: '60%',
        height: '80%',
        'position': 'absolute',
        'top': '10%',
        'left': '3.3%',
        "background-color": "#366CA3",
        "border": "4px double #3F80C0"
      });
      this.gameDiv.append(editdiv);
      $(vis).attr({
        'id': this.visualDiv
      });
      $(vis).css({
        width: '30%',
        height: '80%',
        'position': 'absolute',
        'top': '10%',
        'right': '3.3%',
        "background-color": "#366CA3",
        "border": "4px double #3F80C0"
      });
      this.gameDiv.append(vis);
      $(editdiv).append('<img height="15%" style="position:absolute;bottom:1%;right:1%" alt="Play" id="compileAndRun" src="/img/freeware/button_play_green-48px.png" title="Run code"/>');
      $(editdiv).append('<img height="15%" style="position:absolute;bottom:1%;right:8%" alt="Reset" title="Restart level (reset code back to original)" id="resetState" src="/img/cc-bynd/undo_yellow-48px.png"/>');
      $(editdiv).append('<img height="15%" style="position:absolute;bottom:1%;right:15%" alt="Help/Tips" title="Help/Tips" id="help" src="/img/freeware/info-48px.png"/>');
      this.codeEditor = new EditorManager(this.editorDiv, this.config.editor, this.config.code);
      this.interpreter = new CodeInterpreter(this.config.editor.commands);
      this.environment.visualMaster.container.id = this.visualDiv;
      this.visual = new GameVisual(this.environment.visualMaster, this.environment.frameRate);
      this.interpretGameConfigMap();
      this.codeEditor.editor.editor.focus();
      this.addEventListeners();
    };

    GameManager.prototype.gameName = function() {
      return this.environment.key;
    };

    GameManager.prototype.startGame = function(waitForCode) {
      if (waitForCode == null) {
        waitForCode = false;
      }
      this.visual.startGame(this.config.visual);
      this.gameState = new MapGameState(this, waitForCode);
      this.commandMap = new MapGameCommands(this.gameState);
    };

    GameManager.prototype.interpretGameConfigMap = function() {
      var achar, character, key, map, name, x, y, _ref;

      x = this.config.game.offset.x;
      y = this.config.game.offset.y;
      map = this.config.game.map;
      while (map !== "") {
        achar = map.substring(0, 1);
        if (achar in this.config.game.key) {
          name = this.config.game.key[achar];
          this.generateCharacter(name, x, y, true);
        }
        if (achar === '\n') {
          y++;
          x = this.config.game.offset.x;
        } else {
          x++;
        }
        map = map.substring(1);
      }
      _ref = this.config.game.characters;
      for (key in _ref) {
        character = _ref[key];
        character.index = this.config.visual.characters.indexOf(character.visual);
      }
    };

    GameManager.prototype.generateCharacter = function(name, x, y, staysOnReset, dir) {
      var base, baseName, gflag, num, numLength, visualBase;

      base = deepcopy(this.config.game.characterBase[name]);
      visualBase = deepcopy(this.config.visual.visualBase[base.sprite]);
      base.x = x;
      base.y = y;
      visualBase.x = x;
      visualBase.y = y;
      if (dir != null) {
        base.dir = dir;
      }
      if (base.dir != null) {
        visualBase.dir = base.dir;
      }
      baseName = name;
      numLength = 1;
      while (name in this.config.game.characters) {
        if (name === baseName) {
          name = name + '1';
        } else {
          num = parseInt(name.substring(name.length - numLength), 10);
          num++;
          name = baseName + num;
          numLength = num.toString().length;
        }
      }
      visualBase.name = name;
      base.visual = visualBase;
      if (staysOnReset) {
        if (name === 'gflag') {
          this.config.visual.characters.unshift(visualBase);
        } else if (name === 'protagonist') {
          if (this.config.visual.characters.length > 0) {
            if (this.config.visual.characters[0].name = 'gflag') {
              gflag = this.config.visual.characters.shift();
              this.config.visual.characters.unshift(visualBase);
              this.config.visual.characters.unshift(gflag);
            }
          } else {
            this.config.visual.characters.push(visualBase);
          }
        } else {
          this.config.visual.characters.push(visualBase);
        }
        this.config.game.characters[name] = base;
      }
      return {
        'game': base,
        'visual': visualBase
      };
    };

    GameManager.prototype.gameWon = function(score, stars) {
      var player;

      log("Game Won: " + this.environment.key);
      player = this.environment.player;
      if (player.games[this.environment.key] != null) {
        if ((player.games[this.environment.key].hiscore != null) > score) {
          score = player.games[this.environment.key].hiscore;
        }
        if ((player.games[this.environment.key].stars != null) > stars) {
          stars = player.games[this.environment.key].stars;
        }
      }
      this.environment.codeland.storeGameCompletionData(this.environment.key, {
        hiscore: score,
        stars: stars,
        passed: true
      });
    };

    GameManager.prototype.finishGame = function() {
      var _ref;

      if ((_ref = this.gameState) != null) {
        _ref.stopGame();
      }
      this.codeEditor = null;
      this.interpreter = null;
      this.visual = null;
      this.gameState = null;
      this.commandMap = null;
    };

    GameManager.prototype.addEventListeners = function() {
      jQuery('#compileAndRun').click(this.runStudentCode);
      jQuery('#resetState').click(this.reset);
      jQuery('#help').click(this.helpTips);
      this.codeEditor.onStudentCodeChangeListener(this.startGame.bind(this, false));
      this.codeEditor.onCommandValidation(this.commandsValid);
    };

    GameManager.prototype.commandsValid = function(valid) {
      if (valid) {
        jQuery('#compileAndRun').attr('disabled', false);
        this.canRun = true;
      } else {
        jQuery('#compileAndRun').attr('disabled', true);
        this.canRun = false;
      }
    };

    GameManager.prototype.reset = function() {
      this.codeEditor.resetEditor();
      this.startGame(false);
    };

    GameManager.prototype.runStudentCode = function() {
      this.codeEditor.scan();
      if (!this.canRun) {
        return;
      }
      this.interpreter.scanText(this.codeEditor.getStudentCode());
      this.startGame(true);
      this.interpreter.executeCommands(this.commandMap);
    };

    GameManager.prototype.helpTips = function() {
      var conf, ma, title, _ref, _ref1;

      ma = (_ref = this.config) != null ? (_ref1 = _ref.code) != null ? _ref1.comments : void 0 : void 0;
      if (ma) {
        if (ma.length > 1) {
          title = ma[0];
          ma = ma.slice(1);
          ma[0] = title + '<br>' + ma[0];
        }
        conf = {
          widthpx: 600,
          mesgs: ma,
          parentTag: "body",
          xoffset: "30%",
          yoffset: "30%",
          textscaling: 0.7,
          nextgame: "none",
          gameManager: this.gameManager
        };
        return window.objCloud(conf.widthpx, conf.mesgs, conf.parentTag, conf.xoffset, conf.yoffset, conf.textscaling, conf.nextgame, conf.gameManager);
      }
    };

    return GameManager;

  })();

  MapGameState = (function() {
    var clockHandle;

    clockHandle = null;

    MapGameState.prototype.invalidParameterException = function(value) {
      this.name = 'invalidParameterException';
      this.value = value;
    };

    function MapGameState(gameManager, waitForCode) {
      var character, command, name, _i, _len, _ref, _ref1;

      this.gameManager = gameManager;
      this.stopGame = __bind(this.stopGame, this);
      this.protagonistFalls = __bind(this.protagonistFalls, this);
      this.gameLost = __bind(this.gameLost, this);
      this.gameWon = __bind(this.gameWon, this);
      this.clock = __bind(this.clock, this);
      this.gameConfig = deepcopy(this.gameManager.config.game);
      this.visual = this.gameManager.visual;
      this.score = 0;
      this.stars = 0;
      this.protagonist = this.gameConfig.characters.protagonist;
      this.target = this.gameConfig.characters.gflag;
      this.tick = 0;
      this.tock = 0;
      this.waitTime = 8;
      _ref = this.gameConfig.characters;
      for (name in _ref) {
        character = _ref[name];
        if ((character.AI != null) && (character.moves != null)) {
          this._stand(character);
          _ref1 = character.AI.normal;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            command = _ref1[_i];
            this.executeAICommand(character, command);
          }
        }
      }
      if (clockHandle != null) {
        clearInterval(clockHandle);
      }
      clockHandle = setInterval(this.clock, 17);
      this.startedGame = false;
      this.waiting = false;
      if (!waitForCode) {
        this.start();
      }
      return;
    }

    MapGameState.prototype.executeAICommand = function(character, command) {
      var arg, index, _i, _len, _ref;

      this.character = character;
      _ref = command["arguments"];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        arg = _ref[index];
        if (arg === "character" || arg === "protagonist") {
          command["arguments"][index] = this[arg];
        }
      }
      this[command.command].apply(this, command["arguments"]);
      this.character = null;
    };

    MapGameState.prototype.clock = function() {
      var character, name, _ref, _ref1;

      if (this.startedGame === true) {
        if (this.tick % 30 === 0) {
          this.checkEvents();
          if (!this.waiting) {
            _ref = this.gameConfig.characters;
            for (name in _ref) {
              character = _ref[name];
              this.runCharacterCommand(character);
            }
            this.waiting = true;
          } else {
            _ref1 = this.gameConfig.characters;
            for (name in _ref1) {
              character = _ref1[name];
              this.visual.changeState(character.index, 4);
            }
            this.waiting = false;
          }
        }
        if (!this.waiting && (this.tick - this.waitTime) % 30 === 0) {
          this.tick -= this.waitTime + 1;
        }
      }
      this.visual.getFrame(this.gameManager.config.visual, this.tock);
      this.tick++;
      this.tock++;
    };

    MapGameState.prototype.runCharacterCommand = function(character) {
      var aiCommand, command, result, _i, _j, _len, _len1, _ref, _ref1;

      if (character.moves == null) {
        return;
      }
      if (character.moves.length > 0) {
        command = character.moves.splice(0, 1)[0];
        if (command.line != null) {
          this.gameManager.codeEditor.editorGoToLine(command.line);
        }
        result = command.exec();
        if (character.AI != null) {
          if (!result.success) {
            if (character.AI.failed[command.key] != null) {
              _ref = character.AI.failed[command.key];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                aiCommand = _ref[_i];
                this.executeAICommand(character, aiCommand);
              }
            }
          }
        }
      }
      if (character === this.protagonist && character.moves.length === 0) {
        this.protagonistDoneMoving = true;
      }
      if ((character.AI != null) && character.moves.length === 0) {
        _ref1 = character.AI.normal;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          aiCommand = _ref1[_j];
          this.executeAICommand(character, aiCommand);
        }
      }
      if (result != null ? result.continueExecution : void 0) {
        this.runCharacterCommand(character);
      } else {
        this.score++;
      }
    };

    MapGameState.prototype.leaveTrail = function(placeTrail) {
      var char;

      if ((placeTrail != null) && !this.protagonistDoneMoving) {
        char = this.gameManager.generateCharacter('trail', placeTrail.x, placeTrail.y, false);
        this.visual.pushCharacter(this.gameManager.config.visual, char.visual);
      }
    };

    MapGameState.prototype.checkEvents = function() {
      var character, name, triggers, _ref;

      if (this.protagonist.x < 0 || this.protagonist.x >= this.gameManager.config.visual.grid.gridX || this.protagonist.y < 0 || this.protagonist.y >= this.gameManager.config.visual.grid.gridY) {
        this.gameLost();
      }
      triggers = {
        "victory": this.gameWon,
        "loss": this.gameLost,
        "fall": this.protagonistFalls
      };
      _ref = this.gameConfig.characters;
      for (name in _ref) {
        character = _ref[name];
        if (character === this.protagonist) {
          continue;
        }
        if (this.protagonist.x === character.x && this.protagonist.y === character.y) {
          if (character.trigger != null) {
            if (character.trigger !== "victory" || (character.trigger === "victory" && this.protagonistDoneMoving)) {
              triggers[character.trigger]();
            }
          }
        }
      }
      if (this.protagonistDoneMoving && this.protagonist.moving) {
        this.visual.charAnimate(this.protagonist.index);
        this.protagonist.moving = false;
        this.gameLost();
      }
    };

    MapGameState.prototype.start = function() {
      if (this.protagonist.moves.length > 0) {
        this.visual.charAnimate(this.protagonist.index);
        this.protagonist.moving = true;
      }
      this.protagonistDoneMoving = false;
      this._stand(this.protagonist);
      this.startedGame = true;
    };

    MapGameState.prototype._stand = function(character) {
      if (character == null) {
        character = this.protagonist;
      }
      character.moves.push({
        key: 'stand',
        exec: (function(char) {
          this.visual.changeState(char.index, 4);
          return {
            success: true,
            continueExecution: false
          };
        }).bind(this, character)
      });
    };

    MapGameState.prototype.jump = function(character, steps, line) {
      if (character == null) {
        character = this.protagonist;
      }
      if (character.moves.length > 0 && character.moves[character.moves.length - 1].key === 'stand') {
        character.moves.pop();
      }
      return character.moves.push({
        key: 'jumping',
        exec: (function(char) {
          var success;

          success = this._jump(char);
          return {
            success: success,
            continueExecution: false
          };
        }).bind(this, character)
      });
    };

    MapGameState.prototype.move = function(character, steps, line) {
      if (character == null) {
        character = this.protagonist;
      }
      if (character.moves.length > 0 && character.moves[character.moves.length - 1].key === 'stand') {
        character.moves.pop();
      }
      character.moves.push({
        key: 'startMove',
        exec: (function(char, steps) {
          var success;

          success = this._move(char, steps);
          return {
            success: success,
            continueExecution: false
          };
        }).bind(this, character, steps),
        line: line
      });
    };

    MapGameState.prototype._moving = function(character) {
      if (character == null) {
        character = this.protagonist;
      }
      return character.moves.unshift({
        key: 'moving',
        exec: (function(char) {
          var success;

          success = this._move(char, 1);
          return {
            success: success,
            continueExecution: false
          };
        }).bind(this, character)
      });
    };

    MapGameState.prototype._move = function(character, steps) {
      var hitEvent, i, moved, newx, newy, _i, _ref;

      if (character == null) {
        character = this.protagonist;
      }
      if (isNaN(steps)) {
        throw new this.invalidParameterException(steps);
      }
      for (i = _i = 1; _i < steps; i = _i += 1) {
        this._moving(character);
      }
      moved = false;
      _ref = this.computeStepInDirection(character.dir, character.x, character.y), newx = _ref[0], newy = _ref[1];
      hitEvent = this.checkCanMove(newx, newy, character);
      if (!hitEvent) {
        this.visual.changeState(character.index, character.dir);
        if (character === this.protagonist) {
          this.leaveTrail({
            'x': character.x,
            'y': character.y
          });
        }
        character.x = newx;
        character.y = newy;
        moved = true;
      } else {
        this.visual.changeState(character.index, 4);
      }
      return moved;
    };

    MapGameState.prototype._jump = function(character) {
      var hitEvent, moved, newx, newy, xx, yy, _ref, _ref1;

      if (character == null) {
        character = this.protagonist;
      }
      moved = false;
      _ref = this.computeStepInDirection(character.dir, character.x, character.y), xx = _ref[0], yy = _ref[1];
      _ref1 = this.computeStepInDirection(character.dir, xx, yy), newx = _ref1[0], newy = _ref1[1];
      hitEvent = this.checkCanMove(newx, newy, character);
      if (!hitEvent) {
        this.visual.changeState(character.index, character.dir + 6);
        if (character === this.protagonist) {
          this.leaveTrail({
            xx: xx,
            yy: yy
          });
          this.leaveTrail({
            'x': character.x,
            'y': character.y
          });
        }
        character.x = newx;
        character.y = newy;
        moved = true;
      } else {
        this.visual.changeState(character.index, 4);
      }
      return moved;
    };

    MapGameState.prototype.checkCanMove = function(newX, newY, character) {
      /*
          Returns true if the character CAN'T move.
      */

      var name, otherCharacter, _ref, _ref1;

      if (character !== this.protagonist && (newX < 0 || newX >= this.gameManager.config.visual.grid.gridX || newY < 0 || newY >= this.gameManager.config.visual.grid.gridY)) {
        return true;
      }
      if (character.group != null) {
        _ref = this.gameConfig.characters;
        for (name in _ref) {
          otherCharacter = _ref[name];
          if (otherCharacter === character) {
            continue;
          }
          if (otherCharacter.blocks == null) {
            continue;
          }
          if (newX === otherCharacter.x && newY === otherCharacter.y && (_ref1 = character.group, __indexOf.call(otherCharacter.blocks, _ref1) >= 0)) {
            return true;
          }
        }
      }
      return false;
    };

    MapGameState.prototype.turn = function(character, direction, line) {
      if (character == null) {
        character = this.protagonist;
      }
      if (character.moves.length > 0 && character.moves[character.moves.length - 1].key === 'stand') {
        character.moves.pop();
      }
      character.moves.push({
        key: 'turn',
        exec: (function(dir, char) {
          var continueExec;

          continueExec = this._turn(char, dir);
          return {
            success: true,
            continueExecution: continueExec
          };
        }).bind(this, direction, character),
        line: line
      });
      this._stand(character);
    };

    MapGameState.prototype.turnRight = function(character, line) {
      if (character == null) {
        character = this.protagonist;
      }
      if (character.moves.length > 0 && character.moves[character.moves.length - 1].key === 'stand') {
        character.moves.pop();
      }
      character.moves.push({
        key: 'turn',
        exec: (function(char) {
          var continueExec;

          continueExec = this._turn(char, (char.dir + 1) % 4);
          return {
            success: true,
            continueExecution: continueExec
          };
        }).bind(this, character),
        line: line
      });
      this._stand(character);
    };

    MapGameState.prototype.turnLeft = function(character, line) {
      if (character == null) {
        character = this.protagonist;
      }
      if (character.moves.length > 0 && character.moves[character.moves.length - 1].key === 'stand') {
        character.moves.pop();
      }
      character.moves.push({
        key: 'turn',
        exec: (function(char) {
          var continueExec;

          continueExec = this._turn(char, (char.dir + 3) % 4);
          return {
            success: true,
            continueExecution: continueExec
          };
        }).bind(this, character),
        line: line
      });
      this._stand(character);
    };

    MapGameState.prototype._turn = function(character, direction) {
      if (character == null) {
        character = this.protagonist;
      }
      if (character.dir === direction) {
        return true;
      } else {
        character.dir = direction;
        this.visual.charFace(character.index, character.dir);
        this.visual.changeState(character.index, 4);
      }
    };

    MapGameState.prototype.gameWon = function() {
      var gn, ma, num;

      if (!this.startedGame) {
        return;
      }
      playAudio('victory.ogg');
      this.stars += 1;
      this.score += 5;
      this.startedGame = false;
      this.gameManager.gameWon(this.score, this.stars);
      gn = this.gameManager.gameName();
      num = parseInt(gn.charAt(gn.length - 1));
      num++;
      if (num === 12) {
        num = 1;
      }
      gn = gn.slice(0, gn.length - 1);
      gn = gn.concat(num);
      ma = [];
      ma[0] = "Congratulations!";
      window.objCloud(400, ma, "body", "30%", "30%", 1.5, gn, this.gameManager);
    };

    MapGameState.prototype.gameLost = function() {
      var character, ma, name, _ref;

      if (!this.startedGame) {
        return;
      }
      if (clockHandle != null) {
        clearInterval(clockHandle);
      }
      _ref = this.gameConfig.characters;
      for (name in _ref) {
        character = _ref[name];
        if (this.visual.getState(character.index) !== 5) {
          this.visual.changeState(character.index, 4);
        }
        character.moves = null;
      }
      this.startedGame = false;
      playAudio('defeat.ogg');
      ma = [];
      ma[0] = "Try Again!";
      window.objCloud(400, ma, "body", "30%", "30%", 3, "none", this.gameManager);
      clockHandle = setInterval(this.clock, 17);
    };

    MapGameState.prototype.protagonistFalls = function() {
      var character, name, _ref;

      _ref = this.gameConfig.characters;
      for (name in _ref) {
        character = _ref[name];
        character.moves = null;
      }
      this.visual.changeState(this.protagonist.index, 5);
      setTimeout(this.gameLost, 400);
    };

    MapGameState.prototype.stopGame = function() {
      var character, name, _ref;

      if (clockHandle != null) {
        clearInterval(clockHandle);
      }
      _ref = this.gameConfig.characters;
      for (name in _ref) {
        character = _ref[name];
        this.visual.changeState(character.index, 4);
        character.moves = null;
      }
      this.startedGame = false;
    };

    MapGameState.prototype.computeStepInDirection = function(direction, currentX, currentY) {
      var isEastOrWest, newx, newy, sign, _ref;

      _ref = [-1 + ((direction + 1) & 2), direction & 1], sign = _ref[0], isEastOrWest = _ref[1];
      if (isEastOrWest) {
        newx = currentX + sign;
        newy = currentY;
      }
      if (!isEastOrWest) {
        newx = currentX;
        newy = currentY + sign;
      }
      return [newx, newy];
    };

    return MapGameState;

  })();

  MapGameCommands = (function() {
    function MapGameCommands(gameState) {
      this.gameState = gameState;
      this.mysteryMove = __bind(this.mysteryMove, this);
      this.mysteryGo = __bind(this.mysteryGo, this);
      this.goWest = __bind(this.goWest, this);
      this.goSouth = __bind(this.goSouth, this);
      this.goEast = __bind(this.goEast, this);
      this.goNorth = __bind(this.goNorth, this);
      this.jump = __bind(this.jump, this);
      this.turnAndGo = __bind(this.turnAndGo, this);
      this.turnLeft = __bind(this.turnLeft, this);
      this.turnRight = __bind(this.turnRight, this);
      this.turn = __bind(this.turn, this);
      this.go = __bind(this.go, this);
      return;
    }

    MapGameCommands.prototype.finishedParsingStartGame = function() {
      this.gameState.start();
    };

    MapGameCommands.prototype.go = function(steps, line) {
      if (steps === void 0) {
        steps = 1;
      }
      steps = parseInt(steps.toString(), 10);
      if (line === void 0) {
        line = steps;
        steps = 1;
      }
      return this.gameState.move(this.gameState.protagonist, steps, line);
    };

    MapGameCommands.prototype.turn = function(dir, line) {
      var d;

      if (dir === void 0) {
        return;
      }
      d = $.inArray(dir, ['N', 'E', 'S', 'W']);
      if (d >= 0) {
        this.gameState.turn(this.gameState.protagonist, d, line);
      } else {
        d = $.inArray(dir, ['North', 'East', 'South', 'West']);
        if (d >= 0) {
          this.gameState.turn(this.gameState.protagonist, d, line);
        } else if (!isNaN(d)) {
          this.gameState.turn(this.gameState.protagonist, (4 + dir % 4) % 4, line);
        }
      }
    };

    MapGameCommands.prototype.turnRight = function(line) {
      this.gameState.turnRight(this.gameState.protagonist, line);
    };

    MapGameCommands.prototype.turnLeft = function(line) {
      this.gameState.turnLeft(this.gameState.protagonist, line);
    };

    MapGameCommands.prototype.turnAndGo = function(direction, steps, line) {
      this.turn(direction, line);
      this.go(steps, line);
    };

    MapGameCommands.prototype.jump = function(line) {
      this.gameState.jump(this.gameState.protagonist, line);
    };

    MapGameCommands.prototype.goNorth = function(steps, line) {
      return this.turnAndGo(0, steps, line);
    };

    MapGameCommands.prototype.goEast = function(steps, line) {
      return this.turnAndGo(1, steps, line);
    };

    MapGameCommands.prototype.goSouth = function(steps, line) {
      return this.turnAndGo(2, steps, line);
    };

    MapGameCommands.prototype.goWest = function(steps, line) {
      return this.turnAndGo(3, steps, line);
    };

    MapGameCommands.prototype.mysteryGo = function(line) {
      return this.goEast(4, line);
    };

    MapGameCommands.prototype.mysteryMove = function(line) {
      return this.goWest(2, line);
    };

    return MapGameCommands;

  })();

}).call(this);
