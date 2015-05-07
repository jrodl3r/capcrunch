// CapCrunch UI
// ==================================================
'use strict';

var UI = {

  app_loaded            : false,
  loading_delay         : 500,
  view_update_delay     : 400,
  payroll_header_height : 92,
  payroll_height        : 0,

  init: function(type) {
    var isMobile = UI.detect();
    if (isMobile) {
      UI.showMobileView();
    } else {
      UI.launch(type);
      UI.events();
    }
  },

  detect: function() {
    var device   = navigator.userAgent.toLowerCase(),
        isMobile = Modernizr.touch || (device.match(/(iphone|ipod|ipad)/) || device.match(/(android)/) || device.match(/(iemobile)/) || device.match(/iphone/i) || device.match(/ipad/i) || device.match(/ipod/i) || device.match(/blackberry/i) || device.match(/bada/i));
    return isMobile;
  },

  launch: function(shared) {
    if (!shared) {
      setTimeout(function() {
        UI.showTeamsGrid();
      }, UI.loading_delay);
    }
  },

  // mouse events
  events: function() {
    $('body').on('contextmenu', UI.blockClick);
    $('#app').on('mouseup', UI.clearDrag);
    $('#teams .grid div').on('mouseenter', function() {
      var team = $(this).attr('class');
      $('#grid-svg').contents().find('g.' + team).css('opacity', '1');
    });
    $('#teams .grid div').on('mouseleave', function() {
      var team = $(this).attr('class');
      $('#grid-svg').contents().find('g.' + team).css('opacity', '.4');
    });
  },

  // show mobile splash
  showMobileView: function() {
    $('#loading, #app, header, footer').css('display', 'none');
    $('body').addClass('unsupported');
    $('#main').append('<div id="unsupported"><img className="logo" src="img/logo.min.svg"/><p>Mobile Version Coming Soon...</p></div>');
  },

  // show team select grid
  showTeamsGrid: function() {
    $('#loading, #app, #team-menu').removeClass('active');
    $('#teams').addClass('active');
  },

  // hide team select grid
  hideTeamsGrid: function() {
    UI.resetScroll();
    $('#app, #team-menu').addClass('active');
    $('#teams').removeClass('active');
    if (!UI.app_loaded) {
      $('#grid-reminder').addClass('disabled');
      UI.app_loaded = true;
    }
  },

  // hide loading splash
  hideLoading: function() {
    $('#app, #team-menu').addClass('active');
    $('#loading').removeClass('active');
  },

  // toggle view
  updateView: function(view) {
    if (view === 'payroll') {
      $('#menu, #roster').toggleClass('active');
      UI.updateViewHeight('force');
      setTimeout(() => {
        $('#payroll').toggleClass('active');
      }, UI.view_update_delay);
    } else {
      $('#payroll').toggleClass('active');
      setTimeout(() => {
        UI.resetViewHeight();
        $('#menu, #roster').toggleClass('active');
      }, UI.view_update_delay);
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

  // reset scroll
  resetScroll: function() {
    $('.panel.player-list .inner ul').scrollTop(0);
  },

  // clear drag actions
  clearDrag: function() {
    $('#menu .player-list .item.hover').removeClass('hover');
    $('#menu .player-list .item.clicked').removeClass('clicked');
  },

  // block mouse actions
  blockClick: function(e) {
    e.preventDefault();
    return false;
  }
};

module.exports = UI;
