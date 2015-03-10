// Client
// ==================================================

var CC = (function() {
  'use strict';

  var CC = {

    name           :  'CapCrunch',
    version        :  '0.1.0',


    init: function init() {
      console.log(this.name + ' v' + this.version);
    }
  };

  return CC;
})();


// Document
// --------------------------------------------------

(function() {
  'use strict';

  $(document).ready(function() {
    CC.init();
  });
}());
