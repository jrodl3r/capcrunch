'use strict';

var TeamGrid    = require('./components/team-grid.jsx'),
    Loading     = require('./components/loading.jsx'),
    Header      = require('./components/header.jsx'),
    Footer      = require('./components/footer.jsx'),
    Payroll     = require('./components/payroll.jsx'),
    RosterGrid  = require('./components/roster.jsx'),
    RosterMenu  = require('./components/roster-menu.jsx'),
    Messages    = require('./static/messages.js'),
    Timers      = require('./static/timers.js'),
    UI          = require('./ui.js'),
    Socket      = io.connect('', { 'transports': ['websocket'] });

var update   = React.addons.update,
    dropData = { origin : '', cur : '', last : null, action : '' };

var App = React.createClass({

  getInitialState: function() {
    return {
      rosterData : {
        F1L : { status : 'empty' }, F1C : { status : 'empty' }, F1R : { status : 'empty' },
        F2L : { status : 'empty' }, F2C : { status : 'empty' }, F2R : { status : 'empty' },
        F3L : { status : 'empty' }, F3C : { status : 'empty' }, F3R : { status : 'empty' },
        F4L : { status : 'empty' }, F4C : { status : 'empty' }, F4R : { status : 'empty' },
        FB1 : { status : 'empty' }, FB2 : { status : 'empty' }, FB3 : { status : 'empty' },
        FR1 : { status : 'empty' }, FR2 : { status : 'empty' }, FR3 : { status : 'empty' },
        D1L : { status : 'empty' }, D1R : { status : 'empty' },
        D2L : { status : 'empty' }, D2R : { status : 'empty' },
        D3L : { status : 'empty' }, D3R : { status : 'empty' },
        DB1 : { status : 'empty' }, DB2 : { status : 'empty' },
        DR1 : { status : 'empty' }, DR2 : { status : 'empty' },
        G1L : { status : 'empty' }, G1R : { status : 'empty' },
        GB1 : { status : 'empty' }, GB2 : { status : 'empty' },
        GR1 : { status : 'empty' }, GR2 : { status : 'empty' }},
      teamData   : {
        id       : '',
        name     : '',
        cap      : { players: '', hit : '', space : '', forwards : '', defensemen : '', goaltenders : '', other : '', inactive : '' },
        players  : { forwards : [], defensemen : [], goaltenders : [], other : [], inactive : [] }},
      playerData : { team : '', inplay : [], benched : [], ir : [], cleared : [], traded : [], acquired : [], created : [] },
      altLines   : { FR : false, FB : false, DR : false, DB : false, GR : false, GB : false },
      tradeTeam  : { id : '', forwards : [], defensemen : [], goaltenders : [], inactive : [] },
      tradeData  : { trades : [], user : [], league : [], players : { user : [], league : [] }},
      panelData  : { active : 'trades', loading : false, engaged : false, enabled : true },
      capData    : { year : '2015', hit : '0.000', space : '69.000' },
      viewData   : { active : 'loading', last : '', next : '' },
      shareData  : { name : '', link : '', view : 'input' },
      dragData   : { type : '', group : '', index : '' },
      notify     : { label : '', msg : '' }
    };
  },

  getDefaultProps: function() {
    return {
      minPlayers : 6,
      maxPlayers : 5,
      altLines   : ['FR', 'FB', 'DR', 'DB', 'GR', 'GB'],
      altTiles   : ['FR1', 'FR2', 'FR3', 'FB1', 'FB2', 'FB3', 'DR1', 'DR2', 'DB1', 'DB2', 'GR1', 'GR2', 'GB1', 'GB2']
    };
  },

  componentDidMount: function() {
    var id = this.getRosterId();
    if (id) { Socket.emit('get roster', id); }
    else { this.changeView('teams'); }
    Socket.on('load team', this.loadTeam);
    Socket.on('load trade team', this.loadTradeTeam);
    Socket.on('load roster', this.loadRoster);
    Socket.on('roster saved', this.confirmShare);
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
        if (view === 'roster') { UI.resetPanelScroll(); }
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
      var notify = { label : label, msg : msg };
      this.setState({ notify : notify });
      setTimeout(this.hideNotify, Timers.notify);
    }
  },

  hideNotify: function() {
    var notify = this.state.notify;
    notify.label = '';
    this.setState({ notify : notify });
  },

  clearDrag: function() { // TODO: Make return updated data for setState (avoid multiple state updates + re-renders)
    var panelData = this.state.panelData,
        playerData = this.state.playerData,
        lineData = this.updateAltLines(),
        teamSize = this.getTeamSize(),
        team = this.state.teamData.id, updateData;
    if (teamSize) {
      panelData.enabled = this.isCleanTeam(team);
      if (panelData.enabled) { playerData.team = team; }
    } else {
      playerData.team = '';
      panelData.enabled = true;
    }
    panelData.engaged = false;
    updateData = update(this.state, {
      lineData  : { $set: lineData },
      panelData : { $set: panelData },
      dragData  : { $set: { type : '', group : '', index : '' }}
    });
    this.setState(updateData);
  },

  clearDrop: function() {
    dropData = { origin : '', cur : '', last : null, action : '' };
    UI.clearDrag();
  },


// Team + Player Data
// --------------------------------------------------

  changeTeam: function(id) {
    this.changeView('loading');
    Socket.emit('get team', id);
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
          if (panelData.enabled) { panelData.enabled = false; } // NOTE: Notify/Prompt User - Undo / Switch Team? (Changed Teams w/ Active Roster)
          this.resetTradeData('active');
        }
      } else if (tradeData.user.length || tradeData.league.length) { this.resetTradeData('active'); } // NOTE: Notify/Prompt User Clearing Trade?
      this.setState({ teamData: teamData }, function() { this.loadPlayerData(); });
    } else {
      this.changeView('teams');
      this.notifyUser('error', Messages.error.loading_team);
    }
  },

  getTeamSize: function () {
    var playerData = this.state.playerData;
    return playerData.inplay.length + playerData.benched.length + playerData.created.length + playerData.ir.length;
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
    }}}}}} return team;
  },

  loadPlayerData: function() { // TODO: Pre-Cache player images
    this.changeView('roster');
  },

  getPlayerSortIndex: function(contract, group) { // TODO: Fails on 0.000 / null data
    var len = group.length, z;
    for (z = 0; z < len; z++) {
      if (contract[0] > group[z].contract[0]) {
        return z;
      } else if (contract[0] === group[z].contract[0] && contract[0] > group[z + 1].contract[0] || z === len - 1) {
        return z + 1;
      }
    }
  },


// Roster + Share Data
// --------------------------------------------------

  loadRoster: function(res) {
    if (res && res !== 'error') {
      var data = res;
      var updateData = update(this.state, {
        rosterData : { $set: data.rosterData },
        playerData : { $set: data.playerData },
        shareData  : { name : { $set: data.name }},
        altLines   : { $set: data.altLines },
        capData    : { $set: data.capData },
        tradeData  : { trades : { $set: data.tradeData }}
      });
      this.setState(updateData, function() {
        this.changeTeam(data.activeTeam);
        this.loadAltLines();
      });
    } else {
      this.changeView('teams');
      this.notifyUser('error', Messages.error.loading_roster);
    }
  },

  saveRoster: function(name) { // TODO: if (!this.isCleanTeam()) » Verify Active Team
    if (this.state.playerData.inplay.length >= this.props.minPlayers) {
      var data = {
        name       : name,
        activeTeam : this.state.playerData.team,
        playerData : this.state.playerData,
        rosterData : this.state.rosterData,
        altLines   : this.state.altLines,
        capData    : this.state.capData,
        tradeData  : this.state.tradeData.trades
      };
      var shareData = this.state.shareData;
      shareData.name = name || this.state.teamData.name;
      shareData.view = 'loading';
      this.setState({ shareData : shareData });
      setTimeout(function() {
        Socket.emit('save roster', data);
      }, Timers.save);
    } else { this.notifyUser('tip', Messages.error.min_players); }
  },

  resetRoster: function() {
    var playerData = this.state.playerData, updateData,
        roster = this.state.rosterData, pos;
    for (pos in roster) {
      if (roster.hasOwnProperty(pos)) { roster[pos] = { status : 'empty' }; }
    }
    playerData.team = '';
    playerData.inplay = [];
    playerData.ir = [];
    playerData.benched = [];
    playerData.cleared = []; // TODO: « forEach » if ( player.team === this.state.teamData.id ) player.status = 'injured'
    updateData = update(this.state, {
      rosterData : { $set: roster },
      playerData : { $set: playerData },
      capData    : { $set: { year : '2015', hit : '0.000', space : '69.000' }}
    });
    this.setState(updateData);
  },

  getRosterId: function() {
    var id = decodeURI(location.pathname.substr(1));
    return id ? id : false;
  },

  confirmShare: function(res, id) {
    if (res === 'success') {
      var link = 'http://' + location.host + '/' + id;
      var shareData = this.state.shareData;
      shareData.link = link;
      shareData.view = res;
      this.setState({ shareData : shareData });
    } else {
      this.resetShare();
      this.notifyUser('error', Messages.error.saving_roster);
    }
  },

  resetShare: function() { // resetShareView()
    var shareData = this.state.shareData;
    shareData.view = 'input';
    this.setState({ shareData : shareData });
  },

  buildTextRoster: function () {}, // TODO

  updateCapStats: function(type, salary) {
    var capUpdate = this.state.capData;
    if (type === 'add') {
      capUpdate.hit = (parseFloat(capUpdate.hit) + parseFloat(salary)).toFixed(3);
      capUpdate.space = (parseFloat(capUpdate.space) - parseFloat(salary)).toFixed(3);
    } else {
      capUpdate.hit = (parseFloat(capUpdate.hit) - parseFloat(salary)).toFixed(3);
      capUpdate.space = (parseFloat(capUpdate.space) + parseFloat(salary)).toFixed(3);
    } return capUpdate;
  },


// Trade
// --------------------------------------------------

  changeTradeTeam: function(id) {
    Socket.emit('get trade team', id);
  },

  loadTradeTeam: function(id, data) {
    if (data && data !== 'error') {
      var updateData = update(this.state.tradeTeam, {
        id          : { $set: id },
        forwards    : { $set: data.forwards },
        defensemen  : { $set: data.defensemen },
        goaltenders : { $set: data.goaltenders },
        inactive    : { $set: data.inactive }
      });
      this.setState({ tradeTeam : updateData });
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
    }}} else {
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
        index = this.getPlayerSortIndex(player.contract, team.players[player.group]);
        team.players[player.group].splice(index, 0, player);
    }} return team;
  },

  executeTrade: function() {
    var playerData = this.state.playerData, teamData, updateData,
        tradeData = { trades : [], user : [], league : [], players : { user : [], league : [] }},
        tradeTeam = { id : '', forwards : [], defensemen : [], goaltenders : [], inactive : [] };
    this.changePanelView('loading');
    setTimeout(function() {
      teamData = this.loadTradeData(this.state.teamData);
      if (!playerData.team) { playerData.team = teamData.id; }
      playerData.traded = playerData.traded.concat(this.state.tradeData.players.user);
      playerData.acquired = playerData.acquired.concat(this.state.tradeData.players.league);
      tradeData.trades = this.state.tradeData.trades;
      tradeData.trades.push(this.state.tradeData.players);
      updateData = update(this.state, {
        teamData   : { $set: teamData },
        tradeTeam  : { $set: tradeTeam },
        tradeData  : { $set: tradeData },
        playerData : { $set: playerData },
        panelData  : { loading : { $set: false }}
      });
      this.setState(updateData);
      UI.clearAction('trade-executed');
      UI.resetPanelScroll();
    }.bind(this), Timers.confirm);
  },

  addTradePlayer: function(type, player, index, group) {
    var tradeData = this.state.tradeData,
        teamData = this.state.teamData;
    switch (type) {
      case 'user':
        player.action = 'queued';
        tradeData.user.push(player.id);
        tradeData.players.user.push(player);
        break;
      case 'league':
        player = this.state.tradeTeam[group][index];
        player.group = group;
        player.index = index;
        tradeData.league.push(player.id);
        tradeData.players.league.push(player);
        break;
      default: UI.showActionMessage('trade', Messages.error.trade_player);
    }
    this.setState({ tradeData : tradeData }, function() { this.clearDrag(); });
    setTimeout(function() {
      document.getElementById(player.id + '-trade-item').className = 'active';
    }, Timers.clear);
    document.getElementById('trade-drop-area').className = '';
  },

  removeTradePlayer: function(type, index, id) {
    var tradeData = this.state.tradeData,
        teamData = this.state.teamData, tradeIndex, player;
    setTimeout(function() {
      if (type === 'user') {
        tradeIndex = tradeData.user.indexOf(id);
        player = this.state.tradeData.players.user[tradeIndex];
        teamData.players[player.group][index].action = '';
        tradeData.user.splice(tradeIndex, 1);
        tradeData.players.user.splice(tradeIndex, 1);
      } else {
        tradeIndex = tradeData.league.indexOf(id);
        tradeData.league.splice(tradeIndex, 1);
        tradeData.players.league.splice(tradeIndex, 1);
      }
      this.setState({ tradeData : tradeData });
    }.bind(this), Timers.item);
    document.getElementById(id + '-trade-item').className = '';
  },

  verifyTradePlayer: function(action) {
    if (this.state.tradeData.user.length === this.props.maxPlayers) {
      UI.showActionMessage('trade', Messages.trade.max_players);
      return false;
    } else if (/(created|acquired)/.test(action)) {
      UI.showActionMessage('trade', Messages.trade.active_only);
      return false;
    } return true;
  },

  resetTradeData: function(type) {
    var tradeTeam = this.state.tradeTeam,
        playerData = this.state.playerData, updateData,
        tradeData = { trades : [], user : [], league : [], players : { user : [], league : [] }},
        tradeTeam = { id : '', forwards : [], defensemen : [], goaltenders : [], inactive : [] };
    if (type === 'active') { tradeData.trades = this.state.tradeData.trades; }
    else {
      playerData.acquired = [];
      playerData.traded = [];
    }
    updateData = update(this.state, {
      tradeTeam  : { $set: tradeTeam },
      tradeData  : { $set: tradeData },
      playerData : { $set: playerData }
    });
    this.setState(updateData);
    UI.clearAction('trade-executed');
  },


// Create
// --------------------------------------------------

  createPlayer: function(data) {
    var playerData = this.state.playerData, player = data, updateData;
    this.changePanelView('loading');
    player.team = playerData.team || this.state.teamData.id;
    player.action = 'created';
    player.status = 'active';
    player.id = (9901 + playerData.created.length).toString();
    setTimeout(function() {
      playerData.created.push(player);
      if (!playerData.team) { playerData.team = player.team; }
      updateData = update(this.state, {
        panelData  : { loading : { $set: false }},
        playerData : { $set: playerData }
      });
      this.setState(updateData);
      UI.clearAction('create');
      UI.resetPanelScroll('inactive');
    }.bind(this), Timers.confirm);
  },

  resetCreateData: function () {}, // TODO


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
    this.setState({ dragData : { type : 'item', group : e.currentTarget.getAttribute('data-group'), index : e.currentTarget.getAttribute('data-index') }});
  },

  handleItemMouseUp: function(e) {
    if (e.target.className === 'item clicked') {
      e.target.className = 'item hover';
    }
    this.setState({ dragData : { type : '', group : '', index : '' }});
  },

  handleItemDragStart: function(e) {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text', '');
    e.target.parentNode.className = 'row engaged';
    setTimeout(function() {
      var panelData = update(this.state.panelData, { engaged : { $set: true }});
      this.setState({ panelData : panelData });
    }.bind(this), 1);
  },

  handleItemDragEnd: function(e) {
    var drag = this.state.dragData, player;
    player = drag.group === 'created' ? this.state.playerData.created[drag.index] : this.state.teamData.players[drag.group][drag.index];
    player.group = drag.group;
    if (dropData.cur && dropData.cur === dropData.last) { this.addPlayer(player); }
    else if (dropData.action === 'trade' && this.verifyTradePlayer(player.action)) { this.addTradePlayer('user', player); }
    else {
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
    e.stopPropagation();
    if (this.state.rosterData[e.currentTarget.id].status === 'empty') {
      e.currentTarget.className = 'tile hover';
      dropData.action = this.isAltLine(e.currentTarget.id);
      dropData.cur = e.currentTarget.id;
    }
    dropData.last = e.currentTarget.id;
  },

  handleTileDragLeave: function(e) {
    if (this.state.rosterData[e.currentTarget.id].status === 'empty') { e.currentTarget.className = 'tile'; }
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
    this.setState({ dragData : { type : 'tile', group : e.currentTarget.getAttribute('data-group'), index : e.currentTarget.getAttribute('data-index') }});
  },

  handlePlayerMouseUp: function(e) {
    e.currentTarget.className = 'player active hover';
    this.setState({ dragData : { type : '', group : '', index : '' }});
  },

  handlePlayerDragStart: function(e) {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text', '');
  },

  handlePlayerDragEnd: function(e) {
    if (dropData.last === dropData.cur && dropData.last !== dropData.origin) { this.movePlayer(); }
    else if (dropData.action) {
      if (dropData.action === 'remove') { this.removePlayer(); }
      else if (dropData.action === 'trade' && this.verifyTradePlayer(this.state.rosterData[dropData.origin].action)) { this.removePlayer('trading'); }
      else { this.clearDrag(); }
    } else { this.clearDrag(); }
    this.clearDrop();
  },

  addPlayer: function(player) {
    var playerData = this.state.playerData,
        altStatus = this.isAltLine(dropData.cur),
        capData = this.updateCapStats('add', player.contract[0]), updateData;
    if (!playerData.team) { playerData.team = player.team; }
    if (player.status === 'injured') { playerData.cleared.push(player.id); }
    if (altStatus) { playerData[altStatus].push(player); }
    else { playerData.inplay.push(player); }
    player.status = altStatus || 'inplay';
    updateData = update(this.state, {
      capData    : { $set: capData },
      playerData : { $set: playerData },
      rosterData : { [dropData.cur] : { $set: player }}
    });
    this.setState(updateData, function() { this.clearDrag(); });
  },

  removePlayer: function(trading) {
    var teamData = this.state.teamData,
        playerData = this.state.playerData,
        rosterStatus = this.isAltLine(dropData.origin),
        player = this.state.rosterData[dropData.origin],
        capData = this.updateCapStats('remove', player.contract[0]),
        wasCleared = playerData.cleared.indexOf(player.id),
        status = 'active', index, updateData;
    if (wasCleared !== -1) { playerData.cleared.splice(wasCleared, 1); status = 'injured'; }
    if (player.team === teamData.id && player.group !== 'created') {
      index = teamData.players[player.group].map(function(p){ return p.id; }).indexOf(player.id);
      teamData.players[player.group][index].status = status;
      if (trading) { teamData.players[player.group][index].action = 'queued'; }
    } else if (/(acquired|created)/.test(player.action)) {
      index = playerData[player.action].map(function(p){ return p.id; }).indexOf(player.id);
      playerData[player.action][index].status = status;
    }
    rosterStatus = rosterStatus ? rosterStatus : 'inplay';
    index = playerData[rosterStatus].map(function(p){ return p.id; }).indexOf(player.id);
    playerData[rosterStatus].splice(index, 1);
    updateData = update(this.state, {
      capData    : { $set: capData },
      playerData : { $set: playerData },
      rosterData : { [dropData.origin] : { $set: { status : 'empty' }}}
    });
    this.setState(updateData, function() {
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
    }} else if (/(ir|benched)/.test(player.status)) {
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
    var line = this.props.altLines.indexOf(id.substr(0, 2));
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
      id = this.props.altLines[x];
      if (this.state.altLines[id]) { this.showAltLine(id); }
    }
  },

  updateAltLines: function() {
    var lineData = this.state.altLines, line, pos, tile, x, y;
    for (x = 0; x < 6; x++) {
      line = this.props.altLines[x];
      if (lineData[line]) {
        pos = x < 2 ? 3 : 2;
        for (y = pos; y > 0; y--) {
          tile = line + y;
          if (this.state.rosterData[tile].status !== 'empty') { break; } // line is active
          else if (y < 2) { // line is empty
            this.hideAltLine(line);
            lineData[line] = false;
    }}}} return lineData;
  },


  render: function() {

    return (
      <div id="main">
        <Loading activeView={this.state.viewData.active} />
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
              teamData={this.state.teamData} />
            <RosterMenu
              viewData={this.state.viewData}
              dragData={this.state.dragData}
              panelData={this.state.panelData}
              teamData={this.state.teamData}
              tradeTeam={this.state.tradeTeam}
              tradeData={this.state.tradeData}
              playerData={this.state.playerData}
              shareData={this.state.shareData}
              saveRoster={this.saveRoster}
              resetShare={this.resetShare}
              createPlayer={this.createPlayer}
              executeTrade={this.executeTrade}
              changeTradeTeam={this.changeTradeTeam}
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
              resetRoster={this.resetRoster}
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
        <Footer />
      </div>
    );
  }
});

React.render(<App />, document.body);
