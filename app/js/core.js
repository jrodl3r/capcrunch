// CapCrunch Core
// ==================================================
'use strict';

var Utils = require('./utils');

var Core = {

  init: function init() {
    this.init_events();
  },

  // setup events
  init_events: function init_events() {
    // toggle roster/payroll views
    $('a.payroll, a.roster').on('click', this.toggleView);
  },

  // toggle roster/payroll views
  toggleView: function toggleView(e) {
    var target = $(e.target);
    e.preventDefault();

    if (target.attr('class').indexOf('active') < 0) {
      target.addClass('active');
      // show payroll
      if (target.attr('class').indexOf('payroll') >= 0) {
        $('a.roster').removeClass('active');
        $('#menu, #roster').toggleClass('active');
        setTimeout(function() {
          $('#payroll').toggleClass('active');
        }, 300);
      // show roster
      } else {
        $('a.payroll').removeClass('active');
        $('#payroll').toggleClass('active');
        setTimeout(function() {
          $('#menu, #roster').toggleClass('active');
        }, 300);
      }
    }
  }
};


// Init
// --------------------------------------------------

$(document).ready(function() {
  Core.init();
});
