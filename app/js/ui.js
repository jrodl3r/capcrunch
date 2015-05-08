// CapCrunch UI
// ==================================================
'use strict';

var UI = {

  init: function() {
    UI.detect();
    UI.events();
  },

  detect: function() {
    var device   = navigator.userAgent.toLowerCase(),
        isMobile = Modernizr.touch || (device.match(/(iphone|ipod|ipad)/) || device.match(/(android)/) || device.match(/(iemobile)/) || device.match(/iphone/i) || device.match(/ipad/i) || device.match(/ipod/i) || device.match(/blackberry/i) || device.match(/bada/i));
    if (isMobile) {
      UI.showMobileSplash();
    }
  },

  events: function() {
    $('body').on('contextmenu', UI.blockClick);
    $('#app').on('mouseup', UI.clearDrag);
    $('#teams').on('mouseenter', '.grid div', function() {
      var team = $(this).attr('class');
      $('#grid-svg').contents().find('g.' + team).css('opacity', '1');
    });
    $('#teams').on('mouseleave', '.grid div', function() {
      var team = $(this).attr('class');
      $('#grid-svg').contents().find('g.' + team).css('opacity', '.4');
    });
  },

  // update view
  updateViewHeight: function() {
    var table_height = $('#payroll-table').height(),
        full_height = table_height + 92;
    $('#payroll .inner').css('height', table_height);
    $('#app .wrap').css('height', full_height);
  },

  // reset view
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

  // prevent mouse action
  blockClick: function(e) {
    e.preventDefault();
    return false;
  },

  // show mobile splash
  showMobileSplash: function() {
    $('body').addClass('unsupported');
    $('#loading, #teams, #app, header, footer').css('display', 'none');
    $('#main').append('<div id="unsupported"><img className="logo" src="img/logo.min.svg"/><p>Mobile Version Coming Soon...</p></div>');
  }
};

$(document).ready(UI.init);

module.exports = UI;
