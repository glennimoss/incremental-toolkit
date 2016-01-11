// ==UserScript==
// @name         Reactor Idle
// @namespace    https://github.com/glennimoss/incremental-toolkit
// @author       gim
// @description  Automation for reactoridle.com
// @version      0.01
// @match        http://reactoridle.com/
// @grant        none
// @require      https://raw.githubusercontent.com/glennimoss/incremental-toolkit/master/lib/nums.js
// ==/UserScript==
/* jshint -W097 */
(function () {
  'use strict';

  console.log("Installing Reactor Idle automation... (Testing for update changes)");

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
              window.gameobj = i
              setTimeout(function () {
                "direct" == o && n.init()
              }, 1e3);
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

  console.log("Requiring something from the game...");
  require(['game/actions/SellPowerManuallyAction'],
    function (spm) {
      console.log("Got our required object:", spm);
      seller = setInterval(function () {
        for (let name in gameobj.game.reactors) {
          let r = gameobj.game.reactors[name]
            , filled = r.getPower() / r.getMaxPower()
            ;
          if (filled > 0.9) {
            console.log("Reactor", name, "at", (filled*100).toFixed(1) + "%, selling...");
            (new spm(gameobj.game.reactors.metropolis)).sell();
          }
        }
      }, 5000);
    }
  );
})();
