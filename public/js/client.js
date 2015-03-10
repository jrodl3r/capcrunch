// CapCrunch Client
// ==================================================

var CC = (function() {
  'use strict';

  var CC = {

    init: function init() {
      this.socket = io.connect();
      this.socket.on('test', function(msg) {
        console.log('CapCrunch » ' + msg);
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
