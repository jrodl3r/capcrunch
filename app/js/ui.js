// CapCrunch UI
// ==================================================
'use strict';

var UI = {

  payroll_header_height : 92,
  payroll_height        : 0,

  init: function() {
    // toggle roster/payroll views
    $('#team-menu').on('click', 'a', UI.toggleView);
    // roster mouseup catchall
    $('#app').on('mouseup', UI.unhighlightItems);
    // toggle transactions tabs
    $('#transactions-menu').on('click', 'a', UI.toggleTransactionsView);
    // create player: add salary row
    $('#addSalaryRow').on('click', UI.createPlayerAddSalary);
    // testing
    //$('#team-select').val('CHI').change();
  },

  // toggle roster/payroll views
  toggleView: function(e) {
    e.preventDefault();
    if (!$(this).hasClass('active')) {
      // show payroll
      if ($(this).hasClass('payroll')) {
        // show reminder if no team is selected
        if ($('#team-select').val() === '0') {
          $('#team-select-reminder').addClass('active');
          $('#team-select').on('click', () => {
            $('#team-select-reminder').removeClass('active');
          });
        } else {
          $(this).addClass('active');
          $('a.roster').removeClass('active');
          $('#menu, #roster').toggleClass('active');
          UI.updatePayrollHeight();
          setTimeout(() => {
            $('#payroll').toggleClass('active');
          }, 300);
        }
      // show roster
      } else {
        $(this).addClass('active');
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
  },

  // toggle transactions tab menu
  toggleTransactionsView: function(e) {
    e.preventDefault();
    $('#transactions-menu a, #transactions .tab-area').removeClass('active');
    $(this).addClass('active');
    $('#' + $(this).attr('data-tabview')).addClass('active');
    $('#transactions > .inner').removeClass('createplayer-active freeagents-active trades-active');
    $('#transactions > .inner').addClass($(this).attr('data-tabview') + '-active');
  },

  // create player: add salary row
  createPlayerAddSalary: function(e) {
    e.preventDefault();
  }
};

$(document).ready(UI.init);

module.exports = UI;
