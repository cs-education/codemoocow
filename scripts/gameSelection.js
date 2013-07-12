// Generated by CoffeeScript 1.6.2
(function() {
  window.gameSelector = (function() {
    var cont;

    cont = null;

    function gameSelector(div, dis) {
      var tmp;

      this.div = div;
      this.dis = dis;
      tmp = document.createElement("div");
      cont = $(tmp);
      $(tmp).css({
        height: '100%',
        overflow: 'auto',
        position: 'relative',
        'font-size': ($(window).height() * 0.02) + 'px'
      });
      $(tmp).attr("id", "gameSelection");
      this.div.append(tmp);
      return;
    }

    gameSelector.prototype.buildDiv = function(game, desc, player, canPlay, codeland) {
      var tmp1;

      tmp1 = document.createElement("div");
      $(tmp1).css({
        width: '50%',
        height: '46%',
        'border-style': 'double',
        'border-width': 'medium',
        'margin-bottom': '1%',
        "margin-top": "1%",
        position: 'relative',
        left: '25%',
        "background-color": "#003366"
      });
      $(tmp1).attr("id", "select" + game);
      cont.append(tmp1);
      this.buildAn(tmp1, canPlay);
      this.buildScore(tmp1, player);
      this.buildInfo(tmp1, desc);
      return this.canPlay(tmp1, canPlay, codeland, game);
    };

    gameSelector.prototype.buildAn = function(con, canPlay) {
      var derp, tmp2;

      tmp2 = document.createElement("img");
      $(con).append(tmp2);
      $(tmp2).css({
        width: '25%',
        height: '80%',
        position: 'absolute',
        left: '5%',
        top: '10%',
        margin: 0,
        padding: 0
      });
      derp = function() {
        if ($(tmp2).attr("src") === "img/wmn1_fr1.gif") {
          return $(tmp2).attr("src", "img/wmn1_fr2.gif");
        } else {
          return $(tmp2).attr("src", "img/wmn1_fr1.gif");
        }
      };
      if (canPlay) {
        return setInterval(derp, 450);
      } else {
        return $(tmp2).attr("src", "img/wmn1_fr1.gif");
      }
    };

    gameSelector.prototype.buildScore = function(con, player) {
      var es, ns, tmp, tmp1, tmp2, tmp3, _i, _j, _ref, _ref1;

      tmp = document.createElement("div");
      $(con).append(tmp);
      $(tmp).css({
        width: '25%',
        height: '80%',
        position: 'absolute',
        left: '35%',
        top: '10%',
        margin: 0,
        padding: 0
      });
      tmp1 = document.createElement("p");
      tmp2 = document.createElement("p");
      tmp3 = document.createElement("div");
      $(tmp).append(tmp1);
      $(tmp).append(tmp2);
      $(tmp).append(tmp3);
      if ((player != null ? player.passed : void 0) === true) {
        $(tmp1).text("Status:  Complete");
      } else {
        $(tmp1).text("Status:  Incomplete");
      }
      $(tmp2).text("Hi-Score: " + (player != null ? player.hiscore : 0));
      if (this.dis) {
        $(tmp3).text("Stars: " + (player != null ? player.stars : void 0));
      } else {
        for (ns = _i = 1, _ref = player != null ? player.stars : void 0; _i <= _ref; ns = _i += 1) {
          $(tmp).append("<img src='img/star.png' width='20%' height='20%'></img>");
        }
        for (es = _j = _ref1 = player != null ? player.stars : void 0; _j < 3; es = _j += 1) {
          $(tmp).append("<img src='img/stare.png' width='20%' height='20%'></img>");
        }
      }
    };

    gameSelector.prototype.buildInfo = function(con, desc) {
      var tmp, tmp1, tmp2;

      tmp = document.createElement("div");
      $(con).append(tmp);
      $(tmp).css({
        width: '30%',
        height: '80%',
        position: 'absolute',
        left: '65%',
        top: '10%',
        margin: 0,
        padding: 0
      });
      tmp1 = document.createElement("p");
      tmp2 = document.createElement("p");
      $(tmp).append(tmp1);
      $(tmp).append(tmp2);
      $(tmp1).text("Name:  " + desc.name);
      return $(tmp2).text("Description:  " + desc.description);
    };

    gameSelector.prototype.canPlay = function(con, cp, codeland, game) {
      var ovr;

      if (cp) {
        return $(con).click(function() {
          return codeland.startGame(game);
        });
      } else {
        ovr = document.createElement("div");
        $(con).prepend(ovr);
        return $(ovr).css({
          'opacity': '.5',
          'width': '100%',
          'height': '100%',
          position: 'inherit',
          'z-index': '1',
          'background-color': '#000000'
        });
      }
    };

    return gameSelector;

  })();

}).call(this);
