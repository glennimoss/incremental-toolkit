// ==UserScript==
// @name         Reactor Idle
// @namespace    https://github.com/glennimoss/incremental-toolkit/reactor-idle
// @version      0.1
// @author       gim
// @description  Automation for reactoridle.com
// @match        http://reactoridle.com/
// @grant        none
// @require      https://raw.githubusercontent.com/glennimoss/incremental-toolkit/master/lib/nums.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

console.log("Installing Reactor Idle automation...");

var clicker = setInterval(function () {
  console.log("Selling...");
  $("#sellPowerButton").click();
}, 60000);

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

console.log("Requiring something from the game...");
require(['game/actions/SellPowerManuallyAction'],
  function (spm) {
    console.log("Got our required object:", spm);
    var seller = setInterval(function () {
      console.log("Power:", abbrev_num(gameobj.game.reactors.metropolis.getPower()));
    }, 5000);
    /*
    var seller = new spm(gameobj.game.reactors.metropolis);
    seller.sell();
    */
  }
);
