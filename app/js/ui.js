// CapCrunch UI
// ==================================================
'use strict';

var UI = {

  payroll_header_height : 92,
  payroll_height        : 0,

  init: function() {
    UI.detect();
    UI.mouse();
    //UI.test();
  },

  // testing
  test: function() {
    $('#team-select').val('BUF').change();
  },

  // mouse events
  mouse: function() {
    // block context menu (right-click)
    $('body').on('contextmenu', UI.blockClick);
    // clear drag actions (mouse-up)
    $('#app').on('mouseup', UI.clearDrag);
  },

  // detect mobile
  detect: function() {
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

  // reset scroll
  resetScroll: function() {
    setTimeout(function() {
      $('.panel.player-list .inner ul').scrollTop(0);
    }, 250);
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

$(document).ready(UI.init);

module.exports = UI;
