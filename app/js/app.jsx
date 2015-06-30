'use strict';

require('setimmediate');

var TeamGrid   = require('./components/team-grid.jsx'),
    Loading    = require('./components/loading.jsx'),
    Header     = require('./components/header.jsx'),
    Footer     = require('./components/footer.jsx'),
    Payroll    = require('./components/payroll.jsx'),
    RosterGrid = require('./components/roster.jsx'),
    RosterMenu = require('./components/roster-menu.jsx'),
    League     = require('./static/league.js'),
    Messages   = require('./static/messages.js'),
    Timers     = require('./static/timers.js'),
    TimerMixin = require('react-timer-mixin'),
    State      = require('./state.js'),
    UI         = require('./ui.js'),
    update     = React.addons.update,
    socket     = io();

var dropData = { origin: '', cur: '', last: null, action: '' },
    altLines = ['FR', 'FB', 'DR', 'DB', 'GR', 'GB'],
    onboard  = true;

var App = React.createClass({

  mixins: [TimerMixin],

  getInitialState: function() { return State; },

  componentDidMount: function() {
    var id = this.getRosterId();
    if (id) {
      socket.emit('get roster', id);
      onboard = false;
    } else {
      $(window).on('load', function() { this.changeView('teams'); }.bind(this));
      if (/cc_loaded/.test(document.cookie)) { onboard = false; }
      else { document.cookie = 'cc_loaded=1'; }
    }
    socket.on('load team', this.loadTeam);
    socket.on('load trade team', this.loadTradeTeam);
    socket.on('load picks', this.loadPicks);
    socket.on('load roster', this.loadRoster);
    socket.on('roster saved', this.confirmShare);
  },


// View + UI
// --------------------------------------------------

  changeView: function(view) {
    var active = this.state.viewData.active;
    var last = this.state.viewData.last;
    var next = active === 'teams' && last === 'payroll' ? 'payroll' : null;
    if (this.state.viewData.next && view === 'roster') { view = 'payroll'; }
    if (view !== active) {
      var viewData = update(this.state.viewData, {
        active : { $set: view },
        last   : { $set: active },
        next   : { $set: next }
      });
      this.setState({ viewData : viewData }, function() {
        if (view === 'roster') {
          UI.resetPanelScroll();
          if (onboard && !this.state.playerData.team) {
            UI.loadOnboard();
            onboard = false;
          }}
        if (view === 'payroll') { UI.updateViewHeight(); }
        else if (active === 'payroll') { UI.resetViewHeight(); }
      });
    }
  },

  changePanelView: function(view) {
    var panelData = this.state.panelData;
    if (view === 'loading') { panelData.loading = true; }
    else { panelData.active = view; }
    this.setState({ panelData : panelData });
  },

  toggleActionsTab: function(e) {
    var tab = e.currentTarget.getAttribute('data-tab');
    e.preventDefault();
    if (tab !== this.state.panelData.active) {
      var panelData = update(this.state.panelData, { active : { $set: tab } });
      this.setState({ panelData : panelData });
    }
  },

  notifyUser: function(label, msg) {
    if (!this.state.notify.label) {
      var notify = {label: label, msg: msg};
      this.setState({notify: notify});
      this.setTimeout(this.hideNotify, Timers.notify);
    }
  },

  hideNotify: function() {
    var notify = {label: '', msg: ''};
    this.setState({notify: notify});
  },

  clearDrag: function() {
    var panelData = this.state.panelData,
        playerData = this.state.playerData,
        lineData = this.updateAltLines(),
        teamSize = this.state.capData.players,
        team = this.state.teamData.id;
    if (teamSize) {
      panelData.enabled = this.isCleanTeam(team);
      if (panelData.enabled) { playerData.team = team; }
    } else {
      playerData.team = '';
      panelData.enabled = true;
    }
    panelData.engaged = false;
    this.setState(update(this.state, {
      lineData  : { $set: lineData },
      panelData : { $set: panelData },
      dragData  : { $set: { type : '', group : '', index : '', pos : '' }}
    }), function() {
      if (this.state.shareData.view === 'success') { this.resetShare(); }
    });
  },

  clearDrop: function() {
    dropData = { origin : '', cur : '', last : null, action : '' };
    UI.clearDrag();
  },


// Team + Player Data
// --------------------------------------------------

  changeTeam: function(id) {
    this.changeView('loading');
    socket.emit('get team', id);
    socket.emit('get picks', id);
    UI.resetViewScroll();
  },

  loadTeam: function(data) {
    var teamData, tradeData, playerData, panelData;
    if (data && data !== 'error') {
      teamData = data;
      playerData = this.state.playerData;
      tradeData = this.state.tradeData;
      panelData = this.state.panelData;
      if (playerData.team) {
        teamData = this.loadStatusData(teamData); // Status Data (inplay/benched/ir)
        if (playerData.team === teamData.id) {
          if (tradeData.trades.length) { teamData = this.loadTradeData(teamData, 'loading'); } // Action Data (traded/acquired)
          panelData.enabled = this.isCleanTeam(teamData.id);
        } else { // Passive Action Data (hide players acquired by active team)
          if (tradeData.trades.length) { teamData = this.loadTradeData(teamData, 'loading', 'passive'); }
          if (panelData.enabled) { panelData.enabled = false; } // TODO: Prompt User Trades Disabled
        }}
      this.resetTradeData('active'); // TODO: Prompt User Clearing Trade
      this.setState({ teamData : teamData }, function() {
        this.changeView('roster');
      });
    } else {
      this.changeView('teams');
      this.notifyUser('error', Messages.error.loading_team);
    }
  },

  loadPicks: function(data) {
    var pickData = data;
    this.setState({ pickData : pickData });
  },

  isCleanTeam: function (team) {
    var status = ['inplay', 'benched', 'ir', 'created'], x, y;
    for (x = 0; x < status.length; x++) {
      for (y = 0; y < this.state.playerData[status[x]].length; y++) {
        if (this.state.playerData[status[x]][y].team !== team) { return false; }
      }} return true;
  },

  loadStatusData: function (team) {
    var players = this.state.playerData,
        status = ['inplay', 'benched', 'ir'], x, y, z;
    for (x = 0; x < status.length; x++) {
      if (players[status[x]].length) { // load group
        for (y = 0; y < players[status[x]].length; y++) {
          if (players[status[x]][y].team === team.id && players[status[x]][y].group !== 'created') { // same team + not created?
            for (z = 0; z < team.players[players[status[x]][y].group].length; z++) { // teamData player group
              if (team.players[players[status[x]][y].group][z].id === players[status[x]][y].id) { // id match » update status
                team.players[players[status[x]][y].group][z].status = status[x];
                break;
              }}}}}}
    return team;
  },

  getPlayerSortIndex: function(salary, group) {
    var len = group.length, z;
    for (z = 0; z < len; z++) {
      if (/(UFA|RFA)/.test(group[z].contract[this.state.capData.year])) { return z; }
      else if (parseFloat(salary) > parseFloat(group[z].capnum)) { return z; }
      else if (parseFloat(salary) === parseFloat(group[z].capnum) && parseFloat(salary) > parseFloat(group[z + 1].capnum) || z === len - 1) { return z + 1; }
    }
  },


// Roster + Share Data
// --------------------------------------------------

  loadRoster: function(res) {
    if (res && res !== 'error') {
      var data = res;
      this.setState(update(this.state, {
        rosterData : {$set: data.rosterData},
        playerData : {$set: data.playerData},
        shareData  : { name: {$set: data.name}},
        altLines   : {$set: data.altLines},
        capData    : {$set: data.capData},
        tradeData  : { trades: {$set: data.tradeData}}
      }), function() {
        this.changeTeam(data.activeTeam);
        this.loadAltLines();
        UI.clearHover();
        $('#team-grid div.' + this.state.playerData.team).addClass('active');
      });
    } else {
      this.changeView('teams');
      this.notifyUser('error', Messages.error.loading_roster);
    }
  },

  resetRoster: function() {
    // var roster = this.state.rosterData, pos;
    // for (pos in roster) {
    //   if (roster.hasOwnProperty(pos)) { roster[pos] = { status: 'empty' }; }
    // }
    // playerData.team = '';
    // playerData.inplay = [];
    // playerData.ir = [];
    // playerData.benched = [];
    // playerData.cleared = []; // TODO: playerData.cleared.map(  if ( player.team === this.state.teamData.id ) player.status = 'injured'  )
    // this.setState(update(this.state, {
    //   rosterData : {$set: roster},
    //   playerData : {$set: playerData},
    //   capData    : {$set: { year: 6, hit: '0.000', space: '71.500' }}
    // }));
  },

  shareRoster: function(name, type) { // TODO: !isCleanTeam » Verify Active Team
    if (this.state.playerData.inplay.length >= League.min_roster_size) {
      var shareData = this.state.shareData;
      name = name || this.state.teamData.name;
      shareData.name = name;
      shareData.type = type;
      shareData.view = 'loading';
      this.setState({ shareData : shareData }, function() {
        var data = {
          name       : name,
          activeTeam : this.state.playerData.team,
          playerData : this.state.playerData,
          rosterData : this.state.rosterData,
          altLines   : this.state.altLines,
          capData    : this.state.capData,
          tradeData  : this.state.tradeData.trades
        };
        this.setTimeout(() => { socket.emit('save roster', data, type); }, Timers.save);
      });
    } else { this.notifyUser('tip', Messages.error.min_players); }
  },

  confirmShare: function(res, data) {
    if (res === 'success') {
      var shareData = this.state.shareData;
      shareData.link = 'http://' + location.host + '/' + data.id;
      shareData.view = 'success';
      shareData.text = data.text;
      UI.loader('zc');
      this.setState({ shareData : shareData });
    } else {
      this.resetShare();
      this.notifyUser('error', Messages.error.saving_roster);
    }
  },

  resetShare: function() {
    var shareData = this.state.shareData;
    shareData.view = 'input';
    this.setState({ shareData : shareData });
    setTimeout(function() {
      $('#text-share .copy-label').text('Copy text-only roster to clipboard');
      $('#text-share i').attr('class', 'fa fa-pencil');
    }, Timers.action);
  },

  getRosterId: function() {
    var id = decodeURI(location.pathname.substr(1));
    return id ? id : false;
  },

  updateCapStats: function(type, salary, cap) {
    var data = cap || this.state.capData;
    if (type === 'add') {
      data.players = data.players + 1;
      if (salary !== 'unsigned') {
        data.hit = (parseFloat(data.hit) + parseFloat(salary)).toFixed(3);
        data.space = (parseFloat(data.space) - parseFloat(salary)).toFixed(3);
      }}
    else if (type === 'remove') {
      data.players = data.players - 1;
      if (salary !== 'unsigned') {
        data.hit = (parseFloat(data.hit) - parseFloat(salary)).toFixed(3);
        data.space = (parseFloat(data.space) + parseFloat(salary)).toFixed(3);
      }}
    else if (type == 'signed') {
      data.hit = (parseFloat(data.hit) + parseFloat(salary)).toFixed(3);
      data.space = (parseFloat(data.space) - parseFloat(salary)).toFixed(3);
      data.unsigned = data.unsigned - 1;
    } else if (type === 'undo-signed') {
      data.hit = (parseFloat(data.hit) - parseFloat(salary)).toFixed(3);
      data.space = (parseFloat(data.space) + parseFloat(salary)).toFixed(3);
      data.unsigned = data.unsigned + 1;
    }
    if (salary === 'unsigned') {
      if (type === 'add') { data.unsigned = data.unsigned + 1; }
      else { data.unsigned = data.unsigned - 1; }
    }
    return data;
  },


// Trade
// --------------------------------------------------

  changeTradeTeam: function(id) { socket.emit('get trade team', id); },

  loadTradeTeam: function(data) {
    if (data && data !== 'error') {
      var tradeTeam = data;
      this.setState({ tradeTeam : tradeTeam });
    } else { this.notifyUser('error', Messages.error.loading_team); }
  },

  loadTradeData: function(team, loading, passive) {
    var traded = loading ? this.state.playerData.traded : this.state.tradeData.players.user,
        acquired = loading ? this.state.playerData.acquired : this.state.tradeData.players.league,
        player, index, x, y;
    if (passive) {
      for (x = 0; x < acquired.length; x++) {
        if (acquired[x].team_orig === team.id) {
          player = acquired[x];
          team.players[player.group][player.index].action = 'traded';
        }}}
    else {
      for (x = 0; x < traded.length; x++) {
        player = traded[x];
        index = team.players[player.group].map(function(p){ return p.id; }).indexOf(player.id);
        team.players[player.group][index].action = 'traded';
      }
      for (y = 0; y < acquired.length; y++) {
        player = acquired[y];
        player.action = 'acquired';
        if (!loading) {
          player.team_orig = player.team;
          player.team = this.state.teamData.id;
        }
        index = this.getPlayerSortIndex(player.capnum, team.players[player.group]);
        team.players[player.group].splice(index, 0, player);
      }}
    return team;
  },

  executeTrade: function() {
    var tradeData = { trades : [], user : [], league : [], players : { user : [], league : [] }, picks : { user : [], league : [] }},
        tradeTeam = { id : '', forwards : [], defensemen : [], goaltenders : [], inactive : [], picks : { Y15: [], Y16: [], Y17: [], Y18: [] }},
        playerData = this.state.playerData, teamData, trade = {};
    this.changePanelView('loading');
    this.setTimeout(() => {
      teamData = this.loadTradeData(this.state.teamData);
      if (!playerData.team) { playerData.team = teamData.id; }
      playerData.traded = playerData.traded.concat(this.state.tradeData.players.user);
      playerData.acquired = playerData.acquired.concat(this.state.tradeData.players.league);
      tradeData.trades = this.state.tradeData.trades;
      trade = this.state.tradeData.players;
      trade.picks = this.state.tradeData.picks;
      trade.user_team = this.state.teamData.id;
      trade.league_team = this.state.tradeTeam.id;
      tradeData.trades.push(trade);
      this.setState(update(this.state, {
        teamData   : { $set: teamData },
        tradeTeam  : { $set: tradeTeam },
        tradeData  : { $set: tradeData },
        playerData : { $set: playerData },
        panelData  : { loading : { $set: false }}
      }));
      UI.clearAction('trade-executed');
      UI.resetPanelScroll();
    }, Timers.confirm);
  },

  addTradePlayer: function(type, player, index, group) {
    var tradeData = this.state.tradeData,
        teamData = this.state.teamData;
    if (type === 'user') {
      player.action = 'queued';
      tradeData.user.push(player.id);
      tradeData.players.user.push(player);
    } else {
      player = this.state.tradeTeam[group][index];
      player.group = group;
      player.index = index;
      tradeData.league.push(player.id);
      tradeData.players.league.push(player);
    }
    this.setState({ tradeData : tradeData }, function() {
      $('#trade-item-' + player.id).attr('class', 'add-item active');
      this.clearDrag();
      this.verifyTrade();
    });
    $('#trade-drop-area').removeClass('hover');
  },

  addTradePick: function(type, year, index, label) {
    var tradeData = this.state.tradeData, team, pick, key, id;
    team = type === 'user' ? this.state.teamData.id : this.state.tradeTeam.id;
    id = team + year + type.substr(0, 1) + index;
    key = 'Y' + year;
    pick = type === 'user' ? this.state.pickData[key][index] : this.state.tradeTeam.picks[key][index];
    pick.id = id;
    pick.year = year;
    pick.index = index;
    pick.label = label;
    if (type === 'user') { tradeData.picks.user.push(pick); }
    else if (type === 'league') { tradeData.picks.league.push(pick); }
    this.setState({ tradeData : tradeData }, function() {
      $('#trade-item-' + pick.id).attr('class', 'add-item active');
      this.verifyTrade();
    });
  },

  removeTradePlayer: function(type, index, id) {
    var tradeData = this.state.tradeData,
        teamData = this.state.teamData, tradeIndex, player;
    $('#trade-item-' + id).removeClass('active');
    this.setTimeout(() => {
      if (type === 'user') {
        tradeIndex = tradeData.user.indexOf(id);
        player = this.state.tradeData.players.user[tradeIndex];
        teamData.players[player.group][index].action = '';
        tradeData.user.splice(tradeIndex, 1);
        tradeData.players.user.splice(tradeIndex, 1);
      } else if (type === 'league') {
        tradeIndex = tradeData.league.indexOf(id);
        tradeData.league.splice(tradeIndex, 1);
        tradeData.players.league.splice(tradeIndex, 1);
      }
      else if (type === 'user-pick') { tradeData.picks.user.splice(index, 1); }
      else if (type === 'league-pick') { tradeData.picks.league.splice(index, 1); }
      this.setState({ tradeData : tradeData }, function() {
        this.verifyTrade();
      });
    }, Timers.item);
  },

  verifyTrade: function() {
    if ((this.state.tradeData.user.length + this.state.tradeData.picks.user.length) &&
        (this.state.tradeData.league.length + this.state.tradeData.picks.league.length)) {
      $('#trade-player-button').addClass('enabled'); }
    else { $('#trade-player-button').removeClass('enabled'); }
  },

  verifyTradePlayer: function(action, salary) {
    if (this.state.tradeData.user.length + this.state.tradeData.picks.user.length === League.max_trade_size) {
      UI.showActionMessage('trade', Messages.trade.max_players);
      return false;
    } else if (/(created|acquired)/.test(action) || /UFA/.test(salary)) {
      UI.showActionMessage('trade', Messages.trade.active_only);
      return false;
    } return true;
  },

  resetTradeData: function(type) {
    var tradeTeam = this.state.tradeTeam,
        playerData = this.state.playerData, updateData,
        resetTradeData = { trades: [], user: [], league: [], players: { user: [], league: [] }, picks : { user: [], league: [] }},
        resetTradeTeam = { id: '', forwards: [], defensemen: [], goaltenders: [], inactive: [], picks : { Y15: [], Y16: [], Y17: [], Y18: [] }};
    if (type === 'active') { resetTradeData.trades = this.state.tradeData.trades; }
    else {
      playerData.acquired = [];
      playerData.traded = [];
    }
    updateData = update(this.state, {
      tradeTeam  : { $set: resetTradeTeam },
      tradeData  : { $set: resetTradeData },
      playerData : { $set: playerData }
    });
    this.setState(updateData);
    UI.clearAction('trade-executed');
  },

  undoTrade: function(e) {
    var playerData = this.state.playerData,
        tradeData = this.state.tradeData.trades,
        rosterData = this.state.rosterData,
        teamData = this.state.teamData,
        capData = this.state.capData,
        trade_index = e.target.getAttribute('data-index'),
        inplay = false, unsigned, index, pos, x, y;
    for (x = 0; x < tradeData[trade_index].league.length; x++) {
      if (/(inplay|ir|benched)/.test(tradeData[trade_index].league[x].status)) {
        inplay = true;
        if (tradeData[trade_index].league[x].status === 'inplay') {
          index = playerData.inplay.map(function(p){ return p.id; }).indexOf(tradeData[trade_index].league[x].id);
          playerData.inplay.splice(index, 1);
        } else if (tradeData[trade_index].league[x].status === 'ir') {
          index = playerData.ir.map(function(p){ return p.id; }).indexOf(tradeData[trade_index].league[x].id);
          playerData.ir.splice(index, 1);
        } else {
          index = playerData.benched.map(function(p){ return p.id; }).indexOf(tradeData[trade_index].league[x].id);
          playerData.benched.splice(index, 1);
        }
        for (pos in rosterData) {
          if (rosterData.hasOwnProperty(pos)) {
            if (rosterData[pos].id === tradeData[trade_index].league[x].id) {
              unsigned = rosterData[pos].capnum === '0.000' ? true : false;
              capData = unsigned ? this.updateCapStats('remove', 'unsigned', capData) : this.updateCapStats('remove', rosterData[pos].capnum, capData);
              if (unsigned) {
                index = playerData.unsigned.map(function(p){ return p.id; }).indexOf(tradeData[trade_index].league[x].id);
                playerData.unsigned.splice(index, 1);
              }
              rosterData[pos] = { status : 'empty' };
              break;
            }}}}
      index = playerData.signed.map(function(p){ return p.id; }).indexOf(tradeData[trade_index].league[x].id);
      if (index !== -1) { playerData.signed.splice(index, 1); }
      index = teamData.players[tradeData[trade_index].league[x].group].map(function(p){ return p.id; }).indexOf(tradeData[trade_index].league[x].id);
      teamData.players[tradeData[trade_index].league[x].group].splice(index, 1);
      index = playerData.acquired.map(function(p){ return p.id; }).indexOf(tradeData[trade_index].league[x].id);
      playerData.acquired.splice(index, 1);
    }
    for (y = 0; y < tradeData[trade_index].user.length; y++) {
      index = teamData.players[tradeData[trade_index].user[y].group].map(function(p){ return p.id; }).indexOf(tradeData[trade_index].user[y].id);
      teamData.players[tradeData[trade_index].user[y].group][index].action = '';
      index = playerData.traded.map(function(p){ return p.id; }).indexOf(tradeData[trade_index].user[y].id);
      playerData.traded.splice(index, 1);
    }
    tradeData.splice(trade_index, 1);
    if (inplay) {
      this.setState(update(this.state, {
        capData    : { $set: capData },
        teamData   : { $set: teamData },
        playerData : { $set: playerData },
        rosterData : { $set: rosterData },
        tradeData  : { trades : { $set: tradeData }}
      }), this.updateAltLines);
    } else { this.setState(update(this.state.tradeData, { trades : { $set: tradeData }})); }
  },


// Create + Sign
// --------------------------------------------------

  createPlayer: function(data) {
    var playerData = this.state.playerData, player = data;
    this.changePanelView('loading');
    player.team = playerData.team || this.state.teamData.id;
    player.action = 'created';
    player.status = 'active';
    player.capnum = data.salary;
    player.caphit = data.salary;
    player.duration = data.duration;
    player.id = (9901 + playerData.created.length).toString();
    this.setTimeout(() => {
      playerData.created.push(player);
      if (!playerData.team) { playerData.team = player.team; }
      this.setState(update(this.state, {
        panelData  : { loading : { $set: false }},
        playerData : { $set: playerData }
      }));
      UI.clearAction('create');
      UI.resetPanelScroll('inactive');
    }, Timers.confirm);
  },

  undoCreate: function(e) {
    var playerData = this.state.playerData,
        id = e.target.getAttribute('data-id'),
        index = playerData.created.map(function(p){ return p.id; }).indexOf(id),
        inplay = false, rosterData, capData, unsigned, pos;
    if (/(inplay|ir|benched)/.test(playerData.created[index].status)) {
      rosterData = this.state.rosterData;
      inplay = true;
      if (playerData.created[index].status === 'inplay') {
        index = playerData.inplay.map(function(p){ return p.id; }).indexOf(id);
        playerData.inplay.splice(index, 1);
      } else if (playerData.created[index].status === 'ir') {
        index = playerData.ir.map(function(p){ return p.id; }).indexOf(id);
        playerData.ir.splice(index, 1);
      } else {
        index = playerData.benched.map(function(p){ return p.id; }).indexOf(id);
        playerData.benched.splice(index, 1);
      }
      for (pos in rosterData) {
        if (rosterData.hasOwnProperty(pos)) {
          if (rosterData[pos].id === id) {
            unsigned = rosterData[pos].capnum === '0.000' ? true : false;
            capData = unsigned ? this.updateCapStats('remove', 'unsigned') : this.updateCapStats('remove', rosterData[pos].capnum);
            rosterData[pos] = { status : 'empty' };
            break;
          }}}}
    index = playerData.created.map(function(p){ return p.id; }).indexOf(id);
    playerData.created.splice(index, 1);
    if (inplay) {
      this.setState(update(this.state, {
        capData    : { $set: capData },
        playerData : { $set: playerData },
        rosterData : { $set: rosterData }
      }), this.updateAltLines);
    } else { this.setState(update(this.state.playerData, { $set: playerData })); }
  },

  signPlayer: function(id, index, salary, duration) {
    var playerData = this.state.playerData,
        rosterData = this.state.rosterData,
        teamData = this.state.teamData,
        capData = this.state.capData, team_index, player, contract, pos, x;
    if (!salary) { this.notifyUser('error', Messages.create.missing_salary); }
    else if (duration === '0') { this.notifyUser('error', Messages.create.missing_dur); }
    else {
      player = playerData.unsigned[index];
      player.prev_contract = /(UFA|RFA)/.test(player.contract[6]) ? player.contract[6] : null;
      contract = ['','','','','','','','','','','','','','',''];
      for (x = 6; x < parseInt(duration) + 6; x++) { contract[x] = salary; }
      player.contract = contract;
      player.caphit = salary;
      player.capnum = salary;
      player.duration = duration;
      for (pos in rosterData) {
        if (rosterData.hasOwnProperty(pos)) {
          if (rosterData[pos].id === player.id) {
            rosterData[pos].contract = contract;
            rosterData[pos].capnum = salary;
            rosterData[pos].prev_contract = /(UFA|RFA)/.test(player.prev_contract) ? player.prev_contract : null;
            break;
          }}}
      team_index = teamData.players[player.group].map(function(p) { return p.id; }).indexOf(player.id);
      teamData.players[player.group][team_index].contract = contract;
      teamData.players[player.group][team_index].caphit = salary;
      teamData.players[player.group][team_index].capnum = salary;
      teamData.players[player.group][team_index].prev_contract = /(UFA|RFA)/.test(player.prev_contract) ? player.prev_contract : null;
      capData = this.updateCapStats('signed', salary);
      playerData.unsigned.splice(index, 1);
      playerData.signed.push(player);
      this.setState(update(this.state, {
        capData    : { $set: capData },
        teamData   : { $set: teamData },
        rosterData : { $set: rosterData },
        playerData : { $set: playerData }
      }));
    }
  },

  undoSigning: function(e) {
    var playerData = this.state.playerData,
        rosterData = this.state.rosterData,
        teamData = this.state.teamData,
        capData = this.state.capData,
        id = e.target.getAttribute('data-id'),
        index = e.target.getAttribute('data-index'),
        team_index, player, contract, salary, pos;
    player = playerData.signed[index];
    salary = player.contract[6];
    contract = ['','','','','','','','','','','','','','',''];
    contract[6] = player.prev_contract || '0.000';
    for (pos in rosterData) {
      if (rosterData.hasOwnProperty(pos)) {
        if (rosterData[pos].id === player.id) {
          capData = this.updateCapStats('undo-signed', salary);
          rosterData[pos].contract = contract;
          rosterData[pos].capnum = '0.000';
          rosterData[pos].prev_contract = player.prev_contract || '0.000';
          playerData.unsigned.push(player);
          break;
        }}}
    team_index = teamData.players[player.group].map(function(p) { return p.id; }).indexOf(player.id);
    teamData.players[player.group][team_index].contract = contract;
    teamData.players[player.group][team_index].caphit = '0.000';
    teamData.players[player.group][team_index].capnum = '0.000';
    teamData.players[player.group][team_index].prev_contract = player.prev_contract || '0.000';
    playerData.signed.splice(index, 1);
    this.setState(update(this.state, {
      capData    : { $set: capData },
      teamData   : { $set: teamData },
      rosterData : { $set: rosterData },
      playerData : { $set: playerData }
    }));
  },


// Panels
// --------------------------------------------------

  handleItemMouseEnter: function(e) {
    if (!this.state.dragData.type && !this.state.panelData.engaged) { e.currentTarget.className = 'item hover'; }
  },

  handleItemMouseLeave: function(e) {
    if (e.currentTarget.className !== 'item clicked') { e.currentTarget.className = 'item'; }
  },

  handleItemMouseDown: function(e) {
    e.currentTarget.className = 'item clicked';
    this.setState({ dragData : { type: 'item', group: e.currentTarget.getAttribute('data-group'), index: e.currentTarget.getAttribute('data-index'), pos: e.currentTarget.getAttribute('data-pos') }});
  },

  handleItemMouseUp: function(e) {
    if (e.target.className === 'item clicked') {
      e.target.className = 'item hover';
    }
    this.setState({ dragData : { type: '', group: '', index: '', pos: '' }});
  },

  handleItemDragStart: function(e) {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text', '');
    e.target.parentNode.className = 'row engaged';
    this.setTimeout(() => {
      var panelData = update(this.state.panelData, { engaged : { $set: true }});
      this.setState({ panelData : panelData });
    }, 1);
  },

  handleItemDragEnd: function(e) {
    var player, noaction = false;
    if (dropData.cur && dropData.cur === dropData.last) { this.addPlayer(); }
    else if (dropData.action === 'trade') {
      player = this.state.dragData.group === 'created'
        ? this.state.playerData.created[this.state.dragData.index]
        : this.state.teamData.players[this.state.dragData.group][this.state.dragData.index];
      if (this.verifyTradePlayer(player.action, player.contract[this.state.capData.year])) {
        player.group = this.state.dragData.group;
        this.addTradePlayer('user', player);
      } else { noaction = true; }
    } else { noaction = true; }
    if (noaction) {
      e.currentTarget.parentNode.className = 'row';
      e.currentTarget.className = 'item';
      this.clearDrag();
    }
    this.clearDrop();
  },

  handleListDragEnter: function() {
    dropData.last = null;
  },

  handleRemoveDragEnter: function(e) {
    dropData.last = null;
    dropData.action = 'remove';
    e.currentTarget.parentNode.className = 'remove-player active hover';
  },

  handleRemoveDragLeave: function(e) {
    dropData.action = '';
    e.currentTarget.parentNode.className = 'remove-player active';
  },

  handleTradeDragEnter: function() {
    dropData.last = null;
    if (dropData.action !== 'trade') {
      dropData.action = 'trade';
      if (this.state.panelData.active !== 'trades') {
        var panelData = update(this.state.panelData, { active : { $set: 'trades' }});
        this.setState({ panelData : panelData });
      }
      document.getElementById('trade-drop-area').className = 'hover';
    }
  },

  handleTradeDragLeave: function() {
    dropData.action = '';
    document.getElementById('trade-drop-area').className = '';
  },


// Roster
// --------------------------------------------------

  handleGridDragEnter: function() {
    dropData.last = null;
    dropData.action = '';
  },

  handleTileDragEnter: function(e) {
    var id = e.currentTarget.id;
    e.stopPropagation();
    if (this.state.rosterData[id].status === 'empty') {
      e.currentTarget.className = 'tile hover';
      dropData.action = this.isAltLine(id);
      dropData.cur = id;
    }
    dropData.last = id;
  },

  handleTileDragLeave: function(e) {
    $(e.currentTarget).removeClass('hover');
  },

  handlePlayerMouseEnter: function(e) {
    if (!this.state.dragData.type) { e.currentTarget.className = 'player active hover'; }
  },

  handlePlayerMouseLeave: function(e) {
    if (!this.state.dragData.type) { e.currentTarget.className = 'player active'; }
  },

  handlePlayerMouseDown: function(e) {
    e.currentTarget.className = 'player active clicked';
    dropData.origin = e.currentTarget.parentNode.id;
    this.setState({ dragData : { type: 'tile', group: e.currentTarget.getAttribute('data-group'), index: '', pos: e.currentTarget.getAttribute('data-pos') }});
  },

  handlePlayerMouseUp: function(e) {
    e.currentTarget.className = 'player active hover';
    this.setState({ dragData : { type: '', group: '', index: '', pos: '' }});
  },

  handlePlayerDragStart: function(e) {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text', '');
  },

  handlePlayerDragEnd: function(e) {
    if (dropData.last === dropData.cur && dropData.last !== dropData.origin) { this.movePlayer(); }
    else if (dropData.action) {
      if (dropData.action === 'remove') { this.removePlayer(); }
      else if (dropData.action === 'trade') {
        if (this.verifyTradePlayer(this.state.rosterData[dropData.origin].action, this.state.rosterData[dropData.origin].contract[this.state.capData.year])) {
          this.removePlayer('trading');
        }
      } else { this.clearDrag(); }
    } else { this.clearDrag(); }
    this.clearDrop();
  },

  addPlayer: function() {
    var player = this.state.dragData.group === 'created'
      ? this.state.playerData.created[this.state.dragData.index]
      : this.state.teamData.players[this.state.dragData.group][this.state.dragData.index],
        unsigned = player.capnum === '0.000' ? true : false,
        altStatus = this.isAltLine(dropData.cur),
        playerData = this.state.playerData,
        capData = unsigned ? this.updateCapStats('add', 'unsigned') : this.updateCapStats('add', player.capnum);
    if (player.status === 'injured') { playerData.cleared.push(player.id); }
    player.group = this.state.dragData.group;
    player.status = altStatus || 'inplay';
    playerData[player.status].push(player);
    if (unsigned && (player.team === this.state.playerData.team || !this.state.playerData.team)) { playerData.unsigned.push(player); }
    if (!playerData.team) { playerData.team = player.team; }
    this.setState(update(this.state, {
      capData    : { $set: capData },
      playerData : { $set: playerData },
      rosterData : { [dropData.cur] : { $set: player }}
    }), function() { this.clearDrag(); });
  },

  removePlayer: function(trading) {
    var teamData = this.state.teamData,
        playerData = this.state.playerData,
        altStatus = this.isAltLine(dropData.origin),
        player = this.state.rosterData[dropData.origin],
        capData = player.capnum === '0.000' ? this.updateCapStats('remove', 'unsigned') : this.updateCapStats('remove', player.capnum),
        wasCleared = playerData.cleared.indexOf(player.id),
        status = 'active', index;
    if (wasCleared !== -1) { playerData.cleared.splice(wasCleared, 1); status = 'injured'; }
    if (player.team === teamData.id && player.group !== 'created') {
      index = teamData.players[player.group].map(function(p){ return p.id; }).indexOf(player.id);
      teamData.players[player.group][index].status = status;
      if (player.prev_contract) {
        teamData.players[player.group][index].contract = ['','','','','','','','','','','','','','',''];
        teamData.players[player.group][index].contract[6] = player.prev_contract;
        teamData.players[player.group][index].capnum = '0.000';
        teamData.players[player.group][index].caphit = '0.000';
        teamData.players[player.group][index].prev_contract = '';
      }
      if (trading) { teamData.players[player.group][index].action = 'queued'; }
    } else if (/(acquired|created)/.test(player.action)) {
      index = playerData[player.action].map(function(p){ return p.id; }).indexOf(player.id);
      playerData[player.action][index].status = status;
    }
    altStatus = altStatus || 'inplay';
    index = playerData[altStatus].map(function(p){ return p.id; }).indexOf(player.id);
    playerData[altStatus].splice(index, 1);
    index = playerData.signed.map(function(p){ return p.id; }).indexOf(player.id);
    if (index !== -1) { playerData.signed.splice(index, 1); }
    index = playerData.unsigned.map(function(p){ return p.id; }).indexOf(player.id);
    if (index !== -1) { playerData.unsigned.splice(index, 1); }
    this.setState(update(this.state, {
      capData    : { $set: capData },
      playerData : { $set: playerData },
      rosterData : { [dropData.origin] : { $set: { status : 'empty' }}}
    }), function() {
      if (trading) { this.addTradePlayer('user', player); }
      else { this.clearDrag(); }
    });
  },

  movePlayer: function() {
    var playerData = this.state.playerData,
        rosterData = this.state.rosterData,
        altStatus = this.isAltLine(dropData.cur),
        player = rosterData[dropData.origin], index, updateData;
    if (altStatus) {
      if (altStatus !== player.status) {
        index = playerData[player.status].map(function(p){ return p.id; }).indexOf(player.id);
        playerData[player.status].splice(index, 1);
        playerData[altStatus].push(player);
        player.status = altStatus;
      }}
    else if (/(ir|benched)/.test(player.status)) {
      index = playerData[player.status].map(function(p){ return p.id; }).indexOf(player.id);
      playerData[player.status].splice(index, 1);
      playerData.inplay.push(player);
      player.status = 'inplay';
    }
    rosterData[dropData.cur] = player;
    rosterData[dropData.origin] = { status : 'empty' };
    updateData = update(this.state, {
      playerData : { $set: playerData },
      rosterData : { $set: rosterData }
    });
    this.setState(updateData, function() { this.clearDrag(); });
  },


// Alt Lines
// --------------------------------------------------

  handleTriggerDragEnter: function(e) {
    var line, lineData;
    line = e.target.getAttribute('data-line');
    e.target.className = 'disabled';
    $('#' + line).addClass('active');
    if (!this.state.altLines[line]) {
      lineData = update(this.state.altLines, { [line] : { $set: true }});
      this.setState({ altLines : lineData });
    }
  },

  isAltLine: function(id) {
    var line = altLines.indexOf(id.substr(0, 2));
    if (line === -1) { return false; }
    else if (line % 2) { return 'benched'; }
    else { return 'ir'; }
  },

  showAltLine: function(id) {
    $('#' + id).addClass('show');
    $('#' + id + '-trigger').addClass('disabled');
  },

  hideAltLine: function(id) {
    $('#' + id).removeClass('active show');
    $('#' + id + '-trigger').removeClass('disabled');
  },

  loadAltLines: function() {
    var id, x;
    for (x = 0; x < 6; x++) {
      id = altLines[x];
      if (this.state.altLines[id]) { this.showAltLine(id); }
    }
  },

  updateAltLines: function() {
    var lineData = this.state.altLines, line, pos, tile, x, y;
    for (x = 0; x < 6; x++) {
      line = altLines[x];
      if (lineData[line]) {
        pos = x < 2 ? 3 : 2;
        for (y = pos; y > 0; y--) { // TODO: Don't do reverse array scans
          tile = line + y;
          if (this.state.rosterData[tile].status !== 'empty') { break; } // line is active
          else if (y < 2) { // line is empty
            this.hideAltLine(line);
            lineData[line] = false;
          }}}}
    return lineData;
  },


  render: function() {

    return (
      <div id="main">
        <Loading activeView={this.state.viewData.active} />
        <div id="onboard"></div>
        <Header
          activeView={this.state.viewData.active}
          activeTeam={this.state.teamData.id}
          changeView={this.changeView}
          notify={this.state.notify} />
        <TeamGrid
          activeView={this.state.viewData.active}
          activeTeam={this.state.teamData.id}
          changeTeam={this.changeTeam} />
        <div id="app" onMouseUp={this.clearDrop}>
          <div className="wrap">
            <Payroll
              activeView={this.state.viewData.active}
              capData={this.state.capData}
              teamData={this.state.teamData}
              pickData={this.state.pickData} />
            <RosterMenu
              capData={this.state.capData}
              viewData={this.state.viewData}
              changeView={this.changeView}
              dragData={this.state.dragData}
              panelData={this.state.panelData}
              teamData={this.state.teamData}
              pickData={this.state.pickData}
              tradeTeam={this.state.tradeTeam}
              tradeData={this.state.tradeData}
              playerData={this.state.playerData}
              shareData={this.state.shareData}
              shareRoster={this.shareRoster}
              resetShare={this.resetShare}
              createPlayer={this.createPlayer}
              undoCreate={this.undoCreate}
              signPlayer={this.signPlayer}
              undoSigning={this.undoSigning}
              undoTrade={this.undoTrade}
              executeTrade={this.executeTrade}
              changeTradeTeam={this.changeTradeTeam}
              addTradePick={this.addTradePick}
              addTradePlayer={this.addTradePlayer}
              removeTradePlayer={this.removeTradePlayer}
              onItemMouseEnter={this.handleItemMouseEnter}
              onItemMouseLeave={this.handleItemMouseLeave}
              onItemMouseDown={this.handleItemMouseDown}
              onItemMouseUp={this.handleItemMouseUp}
              onItemDragStart={this.handleItemDragStart}
              onItemDragEnd={this.handleItemDragEnd}
              onListDragEnter={this.handleListDragEnter}
              onRemoveDragEnter={this.handleRemoveDragEnter}
              onRemoveDragLeave={this.handleRemoveDragLeave}
              onTradeDragEnter={this.handleTradeDragEnter}
              onTradeDragLeave={this.handleTradeDragLeave}
              onToggleActionsTab={this.toggleActionsTab} />
            <RosterGrid
              activeView={this.state.viewData.active}
              capData={this.state.capData}
              dragData={this.state.dragData}
              teamData={this.state.teamData}
              playerData={this.state.playerData}
              rosterData={this.state.rosterData}
              onGridDragEnter={this.handleGridDragEnter}
              onTileDragEnter={this.handleTileDragEnter}
              onTileDragLeave={this.handleTileDragLeave}
              onPlayerMouseEnter={this.handlePlayerMouseEnter}
              onPlayerMouseLeave={this.handlePlayerMouseLeave}
              onPlayerMouseDown={this.handlePlayerMouseDown}
              onPlayerMouseUp={this.handlePlayerMouseUp}
              onPlayerDragStart={this.handlePlayerDragStart}
              onPlayerDragEnd={this.handlePlayerDragEnd}
              onTriggerDragEnter={this.handleTriggerDragEnter} />
          </div>
        </div>
        <Footer activeView={this.state.viewData.active} />
      </div>
    );
  }
});

React.render(<App />, document.body);
