// CapCrunch UI
// ==================================================
'use strict';

var UI = {

  payroll_header_height : 92,
  payroll_height        : 0,

  init: function() {
    // verify drag-n-drop
    UI.featureDetect();
    // toggle roster/payroll views
    $('#team-menu').on('click', 'a', UI.toggleView);
    // roster mouseup catchall
    $('#app').on('mouseup', UI.unhighlightItems);
    // toggle transactions tabs
    $('#transactions-menu').on('click', 'a', UI.toggleTransactionsView);
    // create player: add salary row
    $('#addSalaryRow').on('click', UI.createPlayerAddSalary);
    // reset team-select + panel scroll
    $('#team-select').val('0');
    $('#team-select').on('change', UI.resetScroll);
    // toggle panel view
    $('.panel-toggle-button').on('click', UI.togglePanelView);
    // toggle roster/cap menu
    $('#roster-stats-button').on('mouseover', UI.toggleRosterMenu);
    $('#roster-stats-menu').on('mouseleave', UI.toggleRosterMenu);
    // block right-click
    $('body').on('contextmenu', UI.blockRightClick);
    // testing
    //$('#team-select').val('BUF').change();
  },

  // verify drag-n-drop
  featureDetect: function() {
    var device  = navigator.userAgent.toLowerCase(),
        isTouch = Modernizr.touch || (device.match(/(iphone|ipod|ipad)/) || device.match(/(android)/) || device.match(/(iemobile)/) ||
          device.match(/iphone/i) || device.match(/ipad/i) || device.match(/ipod/i) || device.match(/blackberry/i) || device.match(/bada/i));
    if (isTouch) {
      $('#app, header, footer').css('display', 'none');
      $('body').addClass('unsupported');
      $('#main').append('<div id="unsupported"><img className="logo" src="img/logo.min.svg"/><p>Mobile Version Coming Soon...</p></div>');
    }
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

  // toggle panel view
  togglePanelView: function(e) {
    e.preventDefault();
    if ($(this).hasClass('active')) {
      $(this).parent().parent().removeClass('collapsed');
    } else {
      $(this).parent().parent().addClass('collapsed');
    }
    $(this).toggleClass('active');
  },

  // toggle roster/cap menu
  toggleRosterMenu: function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!$(this).hasClass('disabled')) {
      $('#roster-stats-menu').toggleClass('active');
    }
  },

  // reset panel scroll
  resetScroll: function() {
    setTimeout(function() {
      $('.panel.player-list .inner ul').scrollTop(0);
    }, 250);
  },

  blockRightClick: function(e) {
    e.preventDefault();
    return false;
  },

  // create player: add salary row
  createPlayerAddSalary: function(e) {
    e.preventDefault();
  }
};

$(document).ready(UI.init);

module.exports = UI;
