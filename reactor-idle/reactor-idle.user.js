// ==UserScript==
// @name         Reactor Idle
// @namespace    https://github.com/glennimoss/incremental-toolkit
// @author       gim
// @description  Automation for reactoridle.com
// @version      0.04
// @match        http://reactoridle.com/
// @grant        none
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://raw.githubusercontent.com/glennimoss/incremental-toolkit/master/lib/nums.js
// @require      https://raw.githubusercontent.com/glennimoss/incremental-toolkit/master/lib/gistbin.js
// ==/UserScript==
/* jshint -W097 */
(function () {
'use strict';

console.log("Installing Reactor Idle automation...");

// Excessively complicated method to get a handle of the global game object.
window.define("base/ConfirmedTimestamp", function () {
  var t = 0;
  return {
    getConfirmedTimestamp: function () { return t; },
    load: function (e) {
      require([ "Main", "base/server/Kongregate", "base/server/Paypal", "base/server/Dummy", "base/ConfirmedTimestamp"
              , "base/GoogleAdds", "base/UrlHandler", "logger", "numberFormat", "config/Event/GameEvent"
              , "config/Event/ReactorEvent", "config/Event/UiEvent" ],
        function (e, t, a, i, r, n, s) {
          var cb = function () {
            console.log("Initalizing game...");
            var i = new e
              , r = null
              , o = s.identifySite();
            r = "kongregate" == o ? new t(i) : new a(i);
            i.setExternalApi(r);
            i.init(!0);
            setTimeout(function () {
              "direct" == o && n.init()
            }, 1e3);

            // Customization
            window.gameobj = i  // Grab global game object
            clearInterval(i.submitScoreInterval); // Eliminate annoying message
          }
          console.log("Fetching timestamp...");
          $.get("http://api.reactoridle.com/getTimestamp", function (n) {
            isNaN(Number(n)) || (t = Number(n));
            cb();
          }).fail(function () {
            cb();
          })
        }
      );
    }
  }
});

var seller;

require(['game/actions/SellPowerManuallyAction'],
  function (spm) {
    seller = setInterval(function () {
      for (let name in gameobj.game.reactors) {
        let r = gameobj.game.reactors[name]
          , filled = r.getPower() / r.getMaxPower()
          ;
        if (filled > 0.9) {
          console.log("Reactor", name, "at", (filled*100).toFixed(1) + "%, selling...");
          (new spm(gameobj.game.reactors[name])).sell();
        }
      }
    }, 5000);
  }
);

var bin = new GistBin("reactor-idle")
  , saver = setInterval(function () {
      bin.save("reactor-idle.sav", gameobj.getSaveHandler().getSaveData()).then(function () {
        console.log("Saved game.");
      });
    }, 900000)  // every fifteen mins
  ;

})();
