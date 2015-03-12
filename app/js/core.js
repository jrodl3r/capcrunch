// CapCrunch Client
// ==================================================

var $     = require('jquery'),
    utils = require('./utils');


// Core
// --------------------------------------------------

var CC = (function() {
  'use strict';

  var CC = {

    init: function init() {
      this.socket = io.connect();
      this.socket.on('init', function(msg) {
        utils.init('Utilities');
        console.log('[' + msg + ' Loaded]');
        console.log('[CapCrunch Loaded]');
      });
    }
  };

  return CC;
})();


// Document
// --------------------------------------------------

$(document).ready(function() {
  CC.init();
});
