'use strict';

var Timers   = require('./static/timers.js'),
    Messages = require('./static/messages.js');

var UI = {

  team_loaded : false,
  zc_loaded   : false,
  msg_timeout : null,
  arena_bg    : 'url(http://s3.amazonaws.com/capcrunch/img/bg-arena.jpg)',
  rink_bg     : 'url(http://s3.amazonaws.com/capcrunch/img/bg-rink.jpg)',

  init: function() {
    UI.detect();
    UI.events();
  },

  load: function () {
    $('#grid-reminder, #grid-svg, #team-grid, header .inner').addClass('active');
    UI.resetViewScroll();
  },

  detect: function() {
    if ($.os.phone || $.os.tablet || $.browser.ie) { UI.showDisabledSplash(); }
    if ($.browser.firefox) { $('html').addClass('moz'); }
    if ($.browser.safari) { $('html').addClass('saf'); }
    if (/Win\d{2}|Windows/.test(navigator.platform)) { $('html').addClass('windows'); }
  },

  events: function() {
    $('body').on('contextmenu', UI.blockAction);
    $('#team-grid').on('mouseenter', 'div', function() {
      $(this).addClass('hover');
    });
    $('#team-grid').on('mouseleave', 'div', function() {
      $(this).removeClass('hover');
    });
    $('#team-grid').on('click', 'div', function() {
      $(this).removeClass('hover');
      $('#team-grid div.active').removeClass('active');
      UI.team_loaded = $(this).attr('class');
      $(this).addClass('clicked active');
      setTimeout(function () {
        $('#team-grid div.clicked').removeClass('clicked');
        // $('.active-team-marker').removeClass('inactive');
      }, Timers.loading);
    });
  },

  updateViewHeight: function() {
    setTimeout(function() {
      var table_height = $('#payroll-table').height(),
          full_height = table_height + 92;
      requestAnimationFrame(function () {
        $('#payroll .inner').css('height', table_height);
        $('#app .wrap').css('height', full_height);
        $('#team-select.clicked').removeClass('clicked');
        $('html').css('background-image', UI.arena_bg);
      });
    }, 100);
  },

  resetViewHeight: function() {
    requestAnimationFrame(function () {
      $('#payroll .inner, #app .wrap').css('height', 'auto');
      $('html').css('background-image', UI.rink_bg);
    });
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

  resetPanelScroll: function(panel) {
    panel = panel || '.active.player-list';
    if ($(panel).scrollTop()) {
      $(panel).scrollTo({ endY: 0, duration: 500 });
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
      $('#inactive-menu li.tracker').css('left', '72.5%').css('width', '68px');
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

  showOverviewConfirm: function (e) {
    e.preventDefault();
    $('.confirm-slider.active').removeClass('active');
    $('#' + e.target.getAttribute('data-target')).addClass('active');
  },

  hideOverviewConfirm: function (e) {
    e.preventDefault();
    $('#' + e.target.getAttribute('data-target')).removeClass('active');
  },

  formatSalary: function(e) {
    var str = e.target.value;
    if (str === '' || str === '0') {
      e.target.value = '0.100';
      $(e.target).addClass('active');
    } else { e.target.value = parseFloat(str).toFixed(3); }
  },

  changePlayerSalary: function(e) {
    if (e.target.value > 0) { $(e.target).addClass('active'); }
  },

  checkPlayerSalaryInput: function(e) {
    var str = e.target.value,
        key = String.fromCharCode(e.charCode),
        sel = window.getSelection().toString();
    // allow text-selection overwrite
    if (sel && str.indexOf(sel) > -1 && /\d/.test(key)) { return true; }
    // numbers/single-dot only + block enter key + six-digit max-length
    if (!/\d|\./.test(key) || e.charCode === 13 || str.length === 6) { e.preventDefault(); }
    // starts with digit or dot
    else if (str.length === 0 && !/\d|\./.test(key)) { e.preventDefault(); }
    // single-dot only
    else if (/\./.test(key) && str.indexOf('.') > -1) { e.preventDefault(); }
    // leading-zero must preceed dot
    else if (str.length === 1 && str === '0' && !/\./.test(key)) { e.preventDefault(); }
    // max of 99 million
    else if (str.length === 2 && /\d{2}/.test(str) && !/\./.test(key)) { e.preventDefault(); }
    // prevent 4 decimal-places on single-digit millions
    else if (str.length === 5 && /\d{1}\.\d{3}/.test(str)) { e.preventDefault(); }
  },

  checkPlayerJerseyInput: function(e) {
    var str = e.target.value,
        key = String.fromCharCode(e.charCode),
        sel = window.getSelection().toString();
    // allow text-selection overwrite
    if (sel && str.indexOf(sel) > -1 && /\d/.test(key)) { e.preventDefault(); }
    // numbers only + block enter key + two-digit max-length
    if (!/\d/.test(key) || e.charCode === 13 || str.length === 2) { e.preventDefault(); }
  },

  formatName: function(e) {
    var value = e.target.value;
    if (value === ' ' || value === '-' || value === '.') { e.target.value = ''; }
    else { e.target.value = value.charAt(0).toUpperCase() + value.slice(1); }
  },

  checkPlayerNameInput: function(e) {
    var str = e.target.value,
        key = String.fromCharCode(e.charCode);
    // two-dots/dashes/spaces max-total
    if (str.match(/\./g) && str.match(/\./g).length > 1 && /\./.test(key)) { e.preventDefault(); }
    if (str.match(/\-/g) && str.match(/\-/g).length > 1 && /\-/.test(key)) { e.preventDefault(); }
    if (str.match(/\s/g) && str.match(/\s/g).length > 1 && /\s/.test(key)) { e.preventDefault(); }
    // letters/dashes/spaces/dots + block enter key + single-dash/dot
    else if (!/[a-zA-Z]|-|\s|\./.test(key) || e.charCode === 13) { e.preventDefault(); }
    else if (/-|\./.test(key) && /-|\.|\s/.test(str.substr(str.length - 1))) { e.preventDefault(); }
    // single-space (following letters/dots)
    else if (/\s/.test(key) && /-|\s/.test(str.substr(str.length - 1))) { e.preventDefault(); }
    // starts with letter
    else if (str.length === 0 && !/[a-zA-Z]/.test(key)) { e.preventDefault(); }
  },

  clearDrag: function() {
    $('.clicked').removeClass('clicked');
    $('.drag-cover.active').removeClass('active');
    $('.remove-player').removeClass('active hover');
    $('#trade-drop-area.hover').removeClass('hover');
  },

  clearHover: function() {
    $('.player.active').removeClass('hover');
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

  loadOnboard: function() {
    $('#onboard').css('height', $(window).height() - 100);
    $('#onboard, #help-link').addClass('active');
    setTimeout(function() {
      $('#app > .wrap').addClass('onboarding');
    }, Timers.loading);
    setTimeout(function() {
      $('#onboard').removeClass('active');
      $('#app > .wrap').removeClass('onboarding');
    }, Timers.onboard);
    setTimeout(function() {
      $('#onboard').css('height', 0);
      $('#help-link').removeClass('active');
    }, Timers.onboard + Timers.action);
  },

  showOnboard: function() {
    requestAnimationFrame(function () {
      $('#onboard').css('height', $(window).height() - 100);
      $('#onboard, #help-link').addClass('hover');
      $('#app > .wrap').addClass('onboarding');
    });
  },

  hideOnboard: function() {
    requestAnimationFrame(function () {
      $('#onboard').css('height', 0);
      $('#onboard, #help-link').removeClass('hover');
      $('#app > .wrap').removeClass('onboarding');
    });
  },

  showDisabledSplash: function() {
    var msg = $.browser.ie ? 'IE is currently unsupported<br/><br/>Please use Chrome or Firefox' : 'Mobile Version Coming Soon...';
    $('body').addClass('unsupported');
    $('#loading, #teams, #app, header, footer').css('display', 'none');
    $('#main').append('<div id="unsupported"><img className="logo" src="img/logo.svg"/><p>' + msg + '</p></div>');
  },

  loader: function(type) {
    if (type === 'zc' && !UI.zc_loaded) {
      var sc = document.createElement('script'), client, loaded;
      sc.setAttribute('src', '/js/vendor/zc.js');
      sc.onreadystatechange = sc.onload = function() {
        if (!loaded) {
          setTimeout(function() {
            client = new ZeroClipboard(document.getElementById('text-share'), {swfPath: 'https://s3.amazonaws.com/capcrunch/js/zc.swf'});
            client.on('ready', function(e) {
              client.on('copy', function(event) {
                event.clipboardData.setData('text/plain', event.target.getAttribute('data-clip'));
              });
              client.on('aftercopy', function(event) {
                $('#text-share .copy-label').text('Roster copied to clipboard');
                $('#text-share i').attr('class', 'fa fa-check');
              });
            });
            client.on('error', function(event) {
              $('#text-share').addClass('disabled');
              $('#text-share .copy-label').text('Copy text-only roster disabled (No Flash)');
              ZeroClipboard.destroy();
            });
            loaded = true;
          }, Timers.confirm);
        }
      };
      document.getElementsByTagName('head')[0].appendChild(sc);
      UI.zc_loaded = true;
    } // else if (type === 'onboard') {
    //   var st, rule = '#onboard{background:url(https://s3.amazonaws.com/capcrunch/img/onboard-top.svg) top left no-repeat,url(https://s3.amazonaws.com/capcrunch/img/onboard-actions.svg) bottom/46% no-repeat;}';
    // }
    // st = (function() {
    //   var s = document.createElement('style');
    //   s.appendChild(document.createTextNode(''));
    //   document.head.appendChild(s);
    //   return s;
    // })();
    // st.sheet.insertRule(rule, 0);
  }
};

$(document).ready(UI.init);
$(window).on('load', UI.load);

module.exports = UI;
