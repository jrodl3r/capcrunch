// CapCrunch UI
// ==================================================
'use strict';

var UI = {

  payroll_header_height : 92,
  payroll_height        : 0,

  init: function() {
    UI.featureDetect();
    // roster mouseup catchall
    $('#app').on('mouseup', UI.unhighlightItems);
    // toggle transactions tabs
    $('#transactions-menu').on('click', 'a', UI.toggleTransactionsView);
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

  // mobile/touch splash
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

  // toggle view
  updateView: function(view) {
    if (view === 'payroll') {
      $('#menu, #roster').toggleClass('active');
      UI.updateViewHeight('force');
      setTimeout(() => {
        $('#payroll').toggleClass('active');
      }, 300);
    } else {
      $('#payroll').toggleClass('active');
      setTimeout(() => {
        UI.resetViewHeight();
        $('#menu, #roster').toggleClass('active');
      }, 300);
    }
  },

  // update height
  updateViewHeight: function(force) {
    if (force || UI.payroll_height !== $('#payroll-table').height()) {
      UI.payroll_height = $('#payroll-table').height();
      $('#payroll .inner').css('height', UI.payroll_height);
      $('#app .wrap').css('height', UI.payroll_height + UI.payroll_header_height);
    }
  },

  // reset height
  resetViewHeight: function() {
    $('#payroll .inner, #app .wrap').css('height', 'auto');
  },

  // player-list mouseup catchall
  unhighlightItems: function() {
    $('#menu .player-list .item.clicked').removeClass('clicked');
    $('#roster .player.active.clicked').removeClass('clicked');
    $('#roster .grid.dragging').removeClass('dragging');
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
  }
};

$(document).ready(UI.init);

module.exports = UI;
