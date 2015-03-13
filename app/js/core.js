// CapCrunch Core
// ==================================================
'use strict';

var Utils = require('./utils'),

    Core = {

      init: function init() {

        this.socket = io.connect();
        this.socket.on('init', function() {
          Utils.init('CapCrunch');
        });
      }
    };


// Init
// --------------------------------------------------

$(document).ready(function() {
  Core.init();
});
