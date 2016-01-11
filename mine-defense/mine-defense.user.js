// ==UserScript==
// @name         Mine Defence
// @namespace    https://github.com/glennimoss/incremental-toolkit/mine-defense
// @version      0.02
// @author       gim
// @description  Automation for http://scholtek.com/minedefense
// @match        http://scholtek.com/minedefense
// @grant        none
// @require      https://raw.githubusercontent.com/glennimoss/incremental-toolkit/master/lib/nums.js
// ==/UserScript==
/* jshint -W097 */
var gim = {};
(function () {
'use strict';

console.log("Installing Mine Defense automation...");


var _cost_re = /(\S+) Gold/
  , _sandshrew_sell_thresh = parse_num('1.5Sp')
  , _hired_re = /(\S+) hired/
  , _sandshrew_alch_rate_re = /(\S+) Sandshrew/
  ;

var clicker = setInterval(function () {
  MD.dig(250, 250);

  for (var i=0; i < MD.MAGE_AURA_LEVEL.length; i++) {
    if (MD.MAGE_AURA_LEVEL[i] < MD.MAX_MAGE_AURA) {
      console.log("Clicking mage", i);
      MD.clickMage(i);
    }
  }
}, 200);

var buyer = setInterval(function () {
  var old_force_control = MD.FORCE_CONTROL;
  MD.FORCE_CONTROL = true;
  while (true) {
    var sandshrews_owned = parse_num(_hired_re.exec($("#hireling3").text())[1])
      , sandshrews_alch_rate = parse_num(_sandshrew_alch_rate_re.exec($("#alch-row-counter16").text())[1])
      ;
    if (sandshrews_owned > sandshrews_alch_rate) {
      break;
    }
    MD.hire(3);
  }
  MD.FORCE_CONTROL = old_force_control;
}, 500);

gim.clear = function () {
  clearInterval(clicker);
  clearInterval(buyer);
}

})();
