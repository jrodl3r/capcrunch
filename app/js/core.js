// CapCrunch Core
// ==================================================
'use strict';

var Utils = require('./utils');

var Core = {

  init: function init() {
    this.init_sockets();
    this.init_events();
  },

  // setup socket handlers
  init_sockets: function init_sockets() {
    this.socket = io.connect();
    // load team
    this.socket.on('load team', function (team_id, team_data) {
      var team = team_data[0];
      Core.load_roster(team);
      Core.load_payroll(team);
      Core.set_watermark(team.name);
    });
  },

  // setup events
  init_events: function init_events() {
    // toggle roster/payroll views
    $('a.payroll, a.roster').on('click', this.toggleView);
    // update team
    $('#team-select').on('change', function() {
      Core.socket.emit('get team', $(this).val());
    });
  },

  // populate roster player panels
  load_roster: function load_roster(team) {
    console.log('load roster: ' + team.name);
  },

  // populate payroll table
  load_payroll: function load_payroll(team) {
    console.log('load payroll: ' + team.name);

    $('#payroll h2').text(team.name);
  },

  // update roster-name input placeholder
  set_watermark: function set_watermark(name) {
    $('#share input').attr('placeholder', name);
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
