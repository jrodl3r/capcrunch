// CapCrunch UI
// ==================================================
'use strict';

var UI = {

  payroll_header_height : 92,
  payroll_height        : 0,

  init: function() {
    // toggle roster/payroll
    $('a.payroll, a.roster').on('click', UI.toggleView);
    // roster mouseup catchall
    $('#app').on('mouseup', UI.unhighlightItems);
    // testing
    //$('#team-select').val('CHI').change();
  },

  // toggle roster/payroll
  toggleView: function(e) {
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
          UI.updatePayrollHeight();
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
          UI.resetPayrollHeight();
          $('#menu, #roster').toggleClass('active');
        }, 300);
      }
    }
  },

  // update payroll height
  updatePayrollHeight: function() {
    // don't update unless payroll is active
    if ($('a.payroll').hasClass('active')) {
      UI.payroll_height = $('#team-payroll').height();
      $('#payroll .inner').css('height', UI.payroll_height);
      $('#app .wrap').css('height', UI.payroll_height + UI.payroll_header_height);
    }
  },

  // restore payroll height
  resetPayrollHeight: function() {
    $('#payroll .inner, #app .wrap').css('height', 'auto');
  },

  // player-list mouseup catchall
  unhighlightItems: function() {
    $('#menu .player-list .item.clicked').removeClass('clicked');
    $('#roster .player.active.clicked').removeClass('clicked');
    $('#roster .panel.group.dragging').removeClass('dragging');
  }
};

$(document).ready(UI.init);

module.exports = UI;
