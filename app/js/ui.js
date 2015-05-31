'use strict';

var Timers   = require('./static/timers.js'),
    Messages = require('./static/messages.js');

var UI = {

  team_loaded : false,
  msg_timeout : null,

  init: function() {
    UI.detect();
    UI.events();
  },

  load: function () {
    $('#grid-reminder, #grid-svg, #team-grid, header .inner, footer').addClass('active');
    UI.resetViewScroll();
  },

  detect: function() {
    if ($.os.phone || $.os.tablet && !$.browser.ie) { UI.showMobileSplash(); }
    if ($.browser.firefox) { $('html').addClass('moz'); }
    if ($.browser.safari) { $('html').addClass('saf'); }
  },

  events: function() {
    $('body').on('contextmenu', UI.blockAction);
    $('#team-grid').on('mouseenter', 'div', function() {
      var team = $(this).attr('class');
      $('#grid-svg').contents().find('g.' + team).addClass('hover');
    });
    $('#team-grid').on('mouseleave', 'div', function() {
      var team = $(this).attr('class');
      $('#grid-svg').contents().find('g.' + team).removeClass('hover');
    });
    $('#team-grid').on('click', 'div', function() {
      UI.team_loaded = $(this).attr('class');
      $('#grid-svg').contents().find('g.' + UI.team_loaded).removeClass('hover');
      $(this).addClass('clicked');
      setTimeout(function () {
        $('#team-grid div.' + UI.team_loaded).removeClass('clicked');
      }, Timers.loading);
    });
  },

  updateViewHeight: function() {
    var table_height = $('#payroll-table').height(),
        full_height = table_height + 92;
    $('#payroll .inner').css('height', table_height);
    $('#app .wrap').css('height', full_height);
    $('#team-select').removeClass('clicked');
  },

  resetViewHeight: function() {
    $('#payroll .inner, #app .wrap').css('height', 'auto');
  },

  resetViewScroll: function() {
    var el = $.browser.firefox ? 'html' : 'body';
    if ($(el).scrollTop()) {
      $(el).scrollTo({ endY: 0, duration: 750 });
    }
    if (UI.team_loaded) {
      $('#grid-reminder').addClass('disabled');
    }
  },

  togglePanelView: function(e) {
    e.preventDefault();
    $(e.currentTarget).toggleClass('active');
    $(e.currentTarget).parent().parent().toggleClass('collapsed');
  },

  resetPanelScroll: function(panel) {
    if (panel) {
      panel = '#' + panel + '-list ul';
      if ($(panel).scrollTop()) {
        $(panel).scrollTo({ endY: 0, duration: 750 });
      }
    } else {
      ['forwards', 'defense', 'goalies', 'inactive'].forEach(function(e, i){
        panel = '#' + e + '-list ul';
        if ($(panel).scrollTop()) {
          $(panel).scrollTo({ endY: 0, duration: 750 });
        }
      });
    }
    $('#team-select').removeClass('clicked');
  },

  confirmAction: function(type) {
    $('#' + type + '-player-confirm').attr('class', 'transaction-confirm active');
    $('#' + type + '-player-button').attr('class', 'clicked');
  },

  clearAction: function(type) {
    if (type === 'create') {
      $('#create-player-fname, #create-player-lname, #create-player-jersey, #create-player-salary').attr('class', '').val('');
      $('#create-player-shot, #create-player-position, #create-player-duration').attr('class', '').val('0');
      $('#create-player-confirm').attr('class', 'transaction-confirm');
      $('#create-player-button').attr('class', '');
    } else {
      $('#trade-player-select').val('0');
      $('#add-trade-player').attr('class', 'add-button');
      if (type === 'trade-executed') {
        $('#trade-team-select').val('0');
      }
      $('#trade-player-confirm').attr('class', 'transaction-confirm');
      $('#trade-player-button').attr('class', '');
    }
  },

  showActionMessage: function(type, msg) {
    if (UI.msg_timeout) { clearTimeout(UI.msg_timeout); }
    if (type === 'create') {
      $('#create-player-msg').attr('class', 'warning').text(msg);
    } else {
      $('#trade-player-msg').attr('class', 'warning').text(msg);
      $('#trade-drop-area').removeClass('hover');
    }
    UI.msg_timeout = setTimeout(UI.resetActionMessage, Timers.warning);
  },

  resetActionMessage: function() {
    $('#create-player-msg').removeClass('warning').text(Messages.create.heading);
    $('#trade-player-msg').removeClass('warning').text(Messages.trade.heading);
    UI.msg_timeout = null;
  },

  missingCreateInput: function(input, msg) {
    $('#create-player-' + input).attr('class', 'missing').focus();
    UI.showActionMessage('create', msg);
  },

  missingTradeInput: function() {
    if ($('#trade-team-select').val() === '0') {
      $('#trade-team-select').attr('class', 'missing').focus();
    } else if ($('#trade-player-select').val() === '0') {
      $('#trade-player-select').attr('class', 'missing').focus();
    }
  },

  clearDrag: function() {
    $('.clicked').removeClass('clicked');
    $('.list-drag-cover').removeClass('active');
    $('.remove-player').removeClass('active hover');
  },

  dropEffect: function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  },

  blockAction: function(e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  },

  showMobileSplash: function() {
    $('body').addClass('unsupported');
    $('#loading, #teams, #app, header, footer').css('display', 'none');
    $('#main').append('<div id="unsupported"><img className="logo" src="img/logo.svg"/><p>Mobile Version Coming Soon...</p></div>');
  }
};

$(document).ready(UI.init);
$(window).on('load', UI.load);

module.exports = UI;
