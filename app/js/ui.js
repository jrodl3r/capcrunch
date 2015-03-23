// CapCrunch UI
// ==================================================
'use strict';

var Teams = require('./static/teams.js');

var UI = {

  init: () => {
    // toggle roster/payroll
    $('a.payroll, a.roster').on('click', UI.toggleView);
  },

  // toggle roster/payroll
  toggleView: (e) => {
    var target = $(e.target);
    e.preventDefault();
    if (!target.hasClass('active')) {
      // show payroll
      if (target.hasClass('payroll')) {
        // show reminder if no team is selected
        if ($('#team-select').val() === 'Select Team') {
          $('#team-select-reminder').addClass('active');
          $('#team-select').on('click', () => {
            $('#team-select-reminder').removeClass('active');
          });
        } else {
          target.addClass('active');
          $('a.roster').removeClass('active');
          $('#menu, #roster').toggleClass('active');
          setTimeout(() => {
            $('#payroll').toggleClass('active');
          }, 300);
        }
      // show roster
      } else {
        target.addClass('active');
        $('a.payroll').removeClass('active');
        $('#payroll').toggleClass('active');
        setTimeout(() => {
          $('#menu, #roster').toggleClass('active');
        }, 300);
      }
    }
  }
};

$(document).ready(UI.init);
