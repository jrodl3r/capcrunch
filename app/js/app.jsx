// CapCrunch App
// ==================================================
'use strict';

var TeamMenu    = require('./components/team-menu.jsx'),
    Payroll     = require('./components/payroll.jsx'),
    Roster      = require('./components/roster.jsx'),
    RosterMenu  = require('./components/roster-menu.jsx'),
    Socket      = io.connect('', { 'transports': ['websocket'] });

var dropZoneData = {
    last   : '',
    cur    : null,
    origin : null
  };

var App = React.createClass({
    getInitialState: function() {
      return {
        dragging       : false,
        activeTeam     : '',
        activePlayers  : [],
        curDragPlayer  : {},
        rosterInfo     : {
          id           : '',
          name         : '',
          link         : '',
          hit          : '0.000',
          space        : '69.000'
        },
        rosterData  : {
               F1L  : { status : 'empty' }, F1C : { status : 'empty' }, F1R : { status : 'empty' },
               F2L  : { status : 'empty' }, F2C : { status : 'empty' }, F2R : { status : 'empty' },
               F3L  : { status : 'empty' }, F3C : { status : 'empty' }, F3R : { status : 'empty' },
               F4L  : { status : 'empty' }, F4C : { status : 'empty' }, F4R : { status : 'empty' },
               D1L  : { status : 'empty' }, D1R : { status : 'empty' },
               D2L  : { status : 'empty' }, D2R : { status : 'empty' },
               D3L  : { status : 'empty' }, D3R : { status : 'empty' },
               G1L  : { status : 'empty' }, G1R : { status : 'empty' }
        },
        teamData    : {
          id        : '',
          name      : '',
          cap       : { hit : '', space : '', forwards : '', defensemen : '', goaltenders : '', other : '', inactive : '' },
          players   : { forwards : [], defensemen : [], goaltenders : [], other : [], inactive : [], created : [] }
        },
        playerData  : { team : '', forwards : [], defensemen : [], goaltenders : [], inactive : [] },
        leagueData  : {
          cap       : '69.000',
          trades    : [],
          created   : []
        },
        activeTrade : {
          active    : { team : '', players : [], id_list : [] },
          passive   : { team : '', players : [], id_list : [] }
        }
      };
    },
    getDefaultProps: function() {
      return {
        benchPlayer    : false,
        addTradePlayer : false,
        messages       : {
          trade_players_heading : 'Execute a blockbuster trade for your team:',
          trade_players_max     : 'Five players per team trade maximum...',
          trade_players_oneway  : 'One-way trades only...',
          trade_players_created : 'Active player trades only...'
        }
      };
    },
    componentDidMount: function() {
      if (this.parseRosterURI()) {
        var roster_id = this.parseRosterURI();
        Socket.emit('get roster', roster_id);
      }
      Socket.on('load team', this.loadTeamData);
      Socket.on('load roster', this.loadRosterData);
      Socket.on('load players', this.loadPlayerData);
      Socket.on('roster saved', this.showShareDialog);
    },


    // Helpers
    showNotification: function(type, msg) {
      if (type === 'error') {
        document.getElementById('notify').className = 'active error';
      } else if (type === 'tip') {
        document.getElementById('notify').className = 'active tip';
      } else if (type === 'success') {
        document.getElementById('notify').className = 'active success';
      }
      document.getElementById('notify').innerText = msg;
      setTimeout(function() {
        document.getElementById('notify').className = '';
      }, 4000);
    },
    showLoading: function() {
      var menu = document.getElementById('menu');
      menu.className = menu.className + ' show-loading';
    },
    hideLoading: function() {
      var menu = document.getElementById('menu');
      menu.className = menu.className.replace(' show-loading', '');
    },


    // Team + Player Data
    handleChangeTeam: function(id) {
      Socket.emit('get team', id);
      this.setState({ activeTeam : id });
      this.showLoading();
    },
    loadTeamData: function(data) {
      if (data && data !== 'error') {
        var trade_data, team_data = data;
        team_data.players.created = [];
        for (var i = 0; i < this.state.leagueData.created.length; i++) {
          if (this.state.leagueData.created[i].team === team_data.id) {
            team_data.players.created.push(this.state.leagueData.created[i]);
          }
        }
        trade_data = this.getTradeData(this.state.activeTeam, 'active');
        team_data.players = this.updatePlayerData(team_data.players, trade_data);
        setTimeout(function() {
          this.setState({ teamData: team_data }, function() {
            this.resetTradeData();
            this.hideLoading();
          });
        }.bind(this), 600);
      } else { this.showNotification('error', 'Sorry, There was an error loading that team.'); }
    },
    loadPlayerData: function(team_id, data) {
      if (data && data !== 'error') {
        var updatePlayerData, trade_data, player_data = data;
        trade_data  = this.getTradeData(team_id, 'passive');
        player_data = this.updatePlayerData(player_data, trade_data);
        updatePlayerData = React.addons.update(this.state, {
          playerData : { team        : { $set: player_data.team },
                         forwards    : { $set: player_data.forwards },
                         defensemen  : { $set: player_data.defensemen },
                         goaltenders : { $set: player_data.goaltenders },
                         inactive    : { $set: player_data.inactive }}
        });
        this.setState(updatePlayerData);
      } else {
        this.showNotification('error', 'Sorry, There was an error loading that team.');
      }
    },
    updatePlayerData: function(players, trades) {
      players.forwards    = this.updatePlayerGroup(players.forwards, trades, 'forwards');
      players.defensemen  = this.updatePlayerGroup(players.defensemen, trades, 'defensemen');
      players.goaltenders = this.updatePlayerGroup(players.goaltenders, trades, 'goaltenders');
      players.inactive    = this.updatePlayerGroup(players.inactive, trades, 'inactive');
      return players;
    },
    updatePlayerGroup: function(players, trades, type) {
      var acquired, traded, duplicate, new_players = [];
      if (trades.length) {
        for (var x = 0; x < trades.length; x++) {
          if (trades[x].acquired.length) {
            acquired = trades[x].acquired;
            for (var y = 0; y < acquired.length; y++) {
              if (acquired[y].type === type) {
                duplicate = false;
                for (var z = 0; z < players.length; z++) {
                  if (acquired[y].id === players[z].id) {
                    duplicate = true;
                    if (players[z].actions && players[z].actions.indexOf('traded') !== -1) {
                      players[z].actions.splice(players[z].actions.indexOf('traded'), 1);
                    }
                  }
                }
                if (!duplicate) {
                  if (acquired[y].actions && acquired[y].actions.length) {
                    if (acquired[y].actions.indexOf('acquired') === -1) {
                      acquired[y].actions.push('acquired');
                    }
                  } else { acquired[y].actions = ['acquired']; }
                  new_players.push(acquired[y]);
                }
              }
            }
            if (new_players.length) {
              players = players.concat(new_players);
              players.sort(this.sortPlayersBySalary);
              new_players = [];
            }
          }
          if (trades[x].traded.length) {
            traded = trades[x].traded;
            for (var i = 0; i < traded.length; i++) {
              if (traded[i].type === type) {
                for (var j = 0; j < players.length; j++) {
                  if (traded[i].id === players[j].id) {
                    if (players[j].actions && players[j].actions.length) {
                      if (players[j].actions.indexOf('traded') === -1) {
                        players[j].actions.push('traded');
                      }
                    } else {
                      players[j].actions = ['traded'];
                    }
                  }
                }
              }
            }
          }
        }
      }
      return players;
    },
    sortPlayersBySalary: function(a, b) {
      if (b.contract[0] === a.contract[0] && b.contract.length >= 2 && a.contract.length >= 2) {
        return b.contract[1] - a.contract[1];
      } else {
        return b.contract[0] - a.contract[0];
      }
    },


    // Share Roster
    loadRosterData: function(data) {
      if (data && data !== 'error') {
        var roster_data = data,
            roster_grid = this.state.rosterData,
            updateRosterInfo;
        for (var pos in roster_grid) {
          if (roster_data.lines.hasOwnProperty(pos)) {
            roster_grid[pos] = roster_data.lines[pos];
          }
        }
        updateRosterInfo = React.addons.update(this.state, {
          rosterData    : { $set: roster_grid },
          rosterInfo    : { name  : { $set: roster_data.name },
                            hit   : { $set: roster_data.hit },
                            space : { $set: roster_data.space }},
          activePlayers : { $set: roster_data.activePlayers },
          leagueData    : { created : { $set: roster_data.created },
                            trades  : { $set: roster_data.trades }}
        });
        this.setState(updateRosterInfo);
        document.getElementById('team-select').value = roster_data.activeTeam;
        this.handleChangeTeam(roster_data.activeTeam);
      } else { this.showNotification('error', 'There was an error loading that roster.'); }
    },
    clearRosterData: function() {
      var clearRosterData, blank = [],
          roster_grid = this.state.rosterData;
      for (var pos in roster_grid) {
        if (pos.status !== 'empty') {
          roster_grid[pos] = { status : 'empty' };
        }
      }
      clearRosterData = React.addons.update(this.state, {
        activePlayers : { $set: blank },
        rosterInfo    : { hit   : { $set: '0.000' },
                          space : { $set: '69.000' }},
        rosterData    : { $set: roster_grid }
      });
      this.setState(clearRosterData);
      document.getElementById('roster-stats-menu').className = 'cap-stats-menu disabled';
    },
    showShareDialog: function(status, roster_id) {
      if (status === 'loading') {
        document.getElementById('share-form').className = '';
        document.getElementById('share-dialog').className = 'active';
      } else if (status === 'success' && roster_id) {
        document.getElementById('share-loading').className = '';
        document.getElementById('share-confirm').className = 'active';
        var rosterLink = 'http://' + location.host + '/' + roster_id;
        var updateRosterLink = React.addons.update(this.state, {
          rosterInfo : { link : { $set: rosterLink }}
        });
        this.setState(updateRosterLink);
      } else if (status === 'error') {
        this.showNotification('error', 'Sorry, There was an error saving your roster.');
      }
    },
    handleRosterSubmit: function(e) {
      e.preventDefault();
      var roster_data = {},
          roster_name = this.state.rosterInfo.name || this.state.teamData.name;
      if (this.state.activePlayers.length > 10) {
        roster_data.name          = roster_name;
        roster_data.hit           = this.state.rosterInfo.hit;
        roster_data.space         = this.state.rosterInfo.space;
        roster_data.activeTeam    = this.state.activeTeam;
        roster_data.activePlayers = this.state.activePlayers;
        roster_data.trades        = this.getTradeData(this.state.activeTeam, 'share');
        roster_data.created       = this.getCreatedPlayers(this.state.activeTeam);
        roster_data.lines         = this.state.rosterData;
        this.showShareDialog('loading');
        setTimeout(function() {
          Socket.emit('save roster', roster_data);
        }, 1000);
      } else { this.showNotification('tip', 'Try adding a few more players to your roster first.'); }
    },
    parseRosterURI: function() {
      var roster_id = decodeURI(location.pathname.substr(1));
      if (roster_id) {
        var updateRosterId = React.addons.update(this.state, {
          rosterInfo : { id : { $set: roster_id }}
        });
        this.setState(updateRosterId);
        return roster_id;
      } else { return false; }
    },


    // Trade Players
    getTradeData: function(team_id, status) {
      var cur_trade, trade_data = [], trade_count = 0;
      if (this.state.leagueData.trades.length) {
        for (var i = 0; i < this.state.leagueData.trades.length; i++) {
          cur_trade = this.state.leagueData.trades[i];
          if (status === 'active') {
            if (cur_trade.active.prev_team === team_id && cur_trade.passive.team === team_id) {
              trade_data[trade_count] = { acquired : [], traded : [] };
              trade_data[trade_count].traded = cur_trade.active.players;
              for (var j = 0; j < cur_trade.passive.players.length; j++) {
                cur_trade.passive.players[j].team = team_id;
              }
              trade_data[trade_count].acquired = cur_trade.passive.players;
              trade_count = trade_count + 1;
            }
          } else if (status === 'passive') {
            if (cur_trade.passive.prev_team === team_id && cur_trade.active.team === team_id &&
                cur_trade.active.prev_team === this.state.activeTeam) {
              trade_data[trade_count] = { acquired : [], traded : [] };
              trade_data[trade_count].traded = cur_trade.passive.players;
              trade_data[trade_count].acquired = cur_trade.active.players;
              trade_count = trade_count + 1;
            }
          } else if (status === 'share') {
            if (cur_trade.active.prev_team === team_id && cur_trade.passive.team === team_id) {
              trade_data.push(cur_trade);
            }
          }
        }
      }
      return trade_data;
    },
    resetTradeData: function() {
      var blank = '', empty = [], resetTradeData;
      resetTradeData = React.addons.update(this.state, {
          playerData  : { team        : { $set: blank },
                          forwards    : { $set: empty },
                          defensemen  : { $set: empty },
                          goaltenders : { $set: empty },
                          inactive    : { $set: empty }},
          activeTrade : {
            active    : { team    : { $set: blank },
                          players : { $set: empty },
                          id_list : { $set: empty }},
            passive   : { team    : { $set: blank },
                          players : { $set: empty },
                          id_list : { $set: empty }}}
        });
      this.setState(resetTradeData);
      document.getElementById('trade-team-select').selectedIndex = 0;
    },
    handleTradeExecution: function() {
      var activeTrade = this.state.activeTrade,
          tradeData   = this.state.leagueData.trades,
          blank = '', empty = [], updateTradeData;
      activeTrade.active.prev_team  = activeTrade.active.team;
      activeTrade.active.team       = activeTrade.passive.team;
      activeTrade.passive.prev_team = activeTrade.passive.team;
      activeTrade.passive.team      = activeTrade.active.prev_team;
      updateTradeData = React.addons.update(this.state, {
        leagueData : { trades : { $push: [activeTrade] }}
      });
      this.setState(updateTradeData, function() {
        var player_data, trade_data, updateTeamPlayerData;
        player_data = this.state.teamData.players;
        trade_data  = this.getTradeData(this.state.activeTeam, 'active');
        player_data = this.updatePlayerData(player_data, trade_data);
        updateTeamPlayerData = React.addons.update(this.state, {
          teamData : { players : { $set: player_data }}
        });
        this.showLoading();
        this.setState(updateTeamPlayerData, function() {
          setTimeout(function() {
            this.resetTradeData();
            document.getElementById('trade-player-msg').innerText = this.props.messages.trade_players_heading;
            document.getElementById('trade-player-confirm').className = 'transaction-confirm';
            this.hideLoading();
          }.bind(this), 2000);
        });
      });
    },
    handleChangeTradeTeam: function(id) {
      var updateTradeData = React.addons.update(this.state, {
        activeTrade : { passive : { team : { $set: id }}}
      });
      this.setState(updateTradeData);
      Socket.emit('get players', id);
    },
    handleAddTradePlayer: function(type, player) {
      var updateTradeData;
      if (type === 'passive') {
        updateTradeData = React.addons.update(this.state, {
          activeTrade : { passive : { players : { $push: [player] },
                                      id_list : { $push: [player.id] }}}
        });
      } else if (type === 'active') {
        updateTradeData = React.addons.update(this.state, {
          activeTrade : { active : { team    : { $set: this.state.activeTeam },
                                     players : { $push: [player] },
                                     id_list : { $push: [player.id] }}}
        });
      }
      this.setState(updateTradeData, function() {
        setTimeout(function() {
          document.getElementById(player.id + 'item').className = 'active';
        }, 10);
      });
      document.getElementById('trade-drop-area').className = '';
    },
    handleRemoveTradePlayer: function(type, id) {
      document.getElementById(id + 'item').className = '';
      setTimeout(function() {
        var index, updateTradeData;
        if (type === 'passive') {
          index = this.state.activeTrade.passive.id_list.indexOf(id);
          updateTradeData = React.addons.update(this.state, {
            activeTrade : { passive : { players : { $splice: [[index, 1]] },
                                        id_list : { $splice: [[index, 1]] }}}
          });
        } else if (type === 'active') {
          index = this.state.activeTrade.active.id_list.indexOf(id);
          if (this.state.activeTrade.active.id_list.length > 1) {
            updateTradeData = React.addons.update(this.state, {
              activeTrade : { active : { players : { $splice: [[index, 1]] },
                                         id_list : { $splice: [[index, 1]] }}}
            });
          } else {
            updateTradeData = React.addons.update(this.state, {
              activeTrade : { active : { team    : { $set: '' },
                                         players : { $splice: [[index, 1]] },
                                         id_list : { $splice: [[index, 1]] }}}
            });
          }
        }
        this.setState(updateTradeData);
      }.bind(this), 250);
    },
    handleTradeDragEnter: function(e) {
      this.props.addTradePlayer = true;
      this.props.benchPlayer = false;
      if (this.state.activeTrade.active.id_list.length) {
        e.currentTarget.parentNode.className = 'active hover';
      } else {
        e.currentTarget.parentNode.className = 'hover';
      }
    },
    handleTradeDragLeave: function(e) {
      if (this.state.activeTrade.active.id_list.length) {
        e.currentTarget.parentNode.className = 'active';
      } else {
        e.currentTarget.parentNode.className = '';
      }
    },
    handleTradePlayersError: function(type) {
      var trade_msg  = document.getElementById('trade-player-msg');
      if (type === 'maxed') {
        trade_msg.innerText = this.props.messages.trade_players_max;
        trade_msg.className = 'warning';
        setTimeout(function() {
          if (trade_msg.innerText === this.props.messages.trade_players_max) {
            trade_msg.innerText = this.props.messages.trade_players_heading;
            trade_msg.className = '';
          }
        }.bind(this), 3000);
      } else if (type === 'oneway') {
        trade_msg.innerText = this.props.messages.trade_players_oneway;
        trade_msg.className = 'warning';
        setTimeout(function() {
          if (trade_msg.innerText === this.props.messages.trade_players_oneway) {
            trade_msg.innerText = this.props.messages.trade_players_heading;
            trade_msg.className = '';
          }
        }.bind(this), 3000);
      } else if (type === 'created') {
        trade_msg.innerText = this.props.messages.trade_players_created;
        trade_msg.className = 'warning';
        setTimeout(function() {
          if (trade_msg.innerText === this.props.messages.trade_players_created) {
            trade_msg.innerText = this.props.messages.trade_players_heading;
            trade_msg.className = '';
          }
        }.bind(this), 3000);
      }
    },


    // Create Player
    getCreatedPlayers: function(team_id) {
      var created = this.state.leagueData.created,
          created_players = [];
      if (created.length) {
        for (var i = 0; i < created.length; i++) {
          if (created[i].team === team_id) {
            created_players.push(created[i]);
          }
        }
      }
      return created_players;
    },
    handleCreatePlayer: function(player) {
      var new_player, updateCreatePlayers;
      this.showLoading();
      new_player = {
        lastname  : player.lastname,
        firstname : player.firstname,
        contract  : player.contract,
        shot      : player.shot,
        jersey    : player.jersey,
        image     : '',
        team      : this.state.activeTeam,
        id        : (9900 + this.state.leagueData.created.length).toString(),
        age       : '',
        nation    : '',
        position  : player.position,
        type      : 'inactive',
        status    : 'created',
        actions   : ['created']
      };
      updateCreatePlayers = React.addons.update(this.state, {
        teamData   : { players : { created : { $push: [new_player] }}},
        leagueData : { created : { $push: [new_player] }}
      });
      setTimeout(function() {
        this.setState(updateCreatePlayers);
        this.hideLoading();
      }.bind(this), 2000);
    },


    // Player Tiles
    handlePlayerMouseOver: function(e) {
      if (e.currentTarget.parentNode.dataset.state === 'active') {
        e.currentTarget.className = 'player active hover';
      }
    },
    handlePlayerMouseOut: function(e) {
      if (e.currentTarget.parentNode.dataset.state === 'active') {
        e.currentTarget.className = 'player active';
      }
    },
    handlePlayerMouseDown: function(e) {
      var playerItem = this.state.rosterData[e.currentTarget.parentNode.id];
      e.currentTarget.className = 'player active clicked';
      this.highlightGrid('on', playerItem.type, playerItem.position);
      this.showPlayerBench();
    },
    handlePlayerMouseUp: function(e) {
      e.currentTarget.className = 'player active';
      e.currentTarget.parentNode.className = 'tile active';
      this.highlightGrid('off');
      this.hidePlayerBench();
    },
    handlePlayerDragStart: function(e) {
      var playerItem = e.currentTarget,
          playerData = this.state.rosterData[playerItem.parentNode.id];
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text', playerItem.id);
      dropZoneData.origin = playerItem.parentNode;
      dropZoneData.origin.className = 'tile active engaged';
      this.props.benchPlayer = false;
      this.props.addTradePlayer = false;
      this.setState({ curDragPlayer : playerData, dragging : true });
    },
    handlePlayerDragEnd: function(e) {
      var playerItem       = e.currentTarget,
          rosterData       = this.state.rosterData,
          activePlayers    = this.state.activePlayers,
          dropZone         = dropZoneData.cur,
          originDropZoneId = dropZoneData.origin.id,
          updateRosterData, capData, index;

      // Bench Player
      if (this.props.benchPlayer) {
        capData = this.updateCapStats('remove', rosterData[originDropZoneId].contract[0]);
        index   = activePlayers.indexOf(rosterData[originDropZoneId].id);
        rosterData[originDropZoneId] = { status: 'empty' };
        activePlayers.splice(index, 1);
        updateRosterData = React.addons.update(this.state, {
          dragging      : { $set: false },
          activePlayers : { $set: activePlayers },
          rosterData    : { $set: rosterData },
          rosterInfo    : { hit   : { $set: capData.hit },
                            space : { $set: capData.space }}
        });
        this.setState(updateRosterData);
        dropZoneData.origin.className = 'tile';
        dropZoneData.origin.dataset.state = '';

      // Trade Player
      } else if (this.props.addTradePlayer) {
        if (this.state.activeTrade.active.id_list.length === 5 ||
            this.state.curDragPlayer.team !== this.state.activeTeam ||
            this.state.curDragPlayer.status === 'created') {
          playerItem.className = 'player active';
          dropZoneData.origin.className = 'tile active';
          this.setState({ dragging : false });
          if (this.state.activeTrade.active.id_list.length === 5) {
            this.handleTradePlayersError('maxed');
          } else if (this.state.curDragPlayer.team !== this.state.activeTeam) {
            this.handleTradePlayersError('oneway');
          } else {
            this.handleTradePlayersError('created');
          }
        } else {
          capData = this.updateCapStats('remove', rosterData[originDropZoneId].contract[0]);
          index   = activePlayers.indexOf(rosterData[originDropZoneId].id);
          rosterData[originDropZoneId] = { status: 'empty' };
          activePlayers.splice(index, 1);
          updateRosterData = React.addons.update(this.state, {
            dragging      : { $set: false },
            activePlayers : { $set: activePlayers },
            rosterData    : { $set: rosterData },
            rosterInfo    : { hit   : { $set: capData.hit },
                              space : { $set: capData.space }}
          });
          this.setState(updateRosterData);
          dropZoneData.origin.className = 'tile';
          dropZoneData.origin.dataset.state = '';
          this.handleAddTradePlayer('active', this.state.curDragPlayer);
        }

      // Move Player
      } else if (dropZone && !dropZone.dataset.state && dropZone.id === dropZoneData.last) {
        dropZone.className = 'tile active';
        dropZone.dataset.state = 'active';
        rosterData[originDropZoneId] = { status: 'empty' };
        rosterData[dropZone.id] = this.state.curDragPlayer;
        updateRosterData = React.addons.update(this.state, {
          dragging   : { $set: false },
          rosterData : { $set: rosterData }
        });
        this.setState(updateRosterData);
        dropZoneData.origin.className = 'tile';
        dropZoneData.origin.dataset.state = '';
      } else {
        playerItem.className = 'player active hover';
        dropZoneData.origin.className = 'tile active';
        this.setState({ dragging : false });
      }
      dropZoneData.origin = null;
      this.props.benchPlayer = false;
      this.props.addTradePlayer = false;
      this.highlightGrid('off');
      this.hidePlayerBench();
    },


    // Bench/Remove Player
    showPlayerBench: function() {
      document.getElementById('menu').className = 'section active show-bench';
    },
    hidePlayerBench: function() {
      document.getElementById('menu').className = 'section active';
    },
    handleBenchDragEnter: function(e) {
      this.props.benchPlayer = true;
      this.props.addTradePlayer = false;
      e.currentTarget.parentNode.className = 'bench-player hover';
    },
    handleBenchDragLeave: function(e) {
      e.currentTarget.parentNode.className = 'bench-player';
    },


    // Roster Grid
    updateCapStats: function(type, salary) {
      var hit   = this.state.rosterInfo.hit,
          space = this.state.rosterInfo.space,
          updateCapStats;
      if (type === 'add') {
        hit   = (parseFloat(hit) + parseFloat(salary)).toFixed(3);
        space = (parseFloat(space) - parseFloat(salary)).toFixed(3);
      } else if (type === 'remove') {
        hit   = (parseFloat(hit) - parseFloat(salary)).toFixed(3);
        space = (parseFloat(space) + parseFloat(salary)).toFixed(3);
      }
      updateCapStats = { hit : hit, space : space };
      return updateCapStats;
    },
    highlightGrid: function(flag, type, pos) {
      if (flag === 'on') {
        if (type === 'forwards' || pos && (pos === 'LW' || pos === 'C' || pos === 'RW')) {
          document.getElementById('forwards').className = 'grid dragging';
        } else if (type === 'defensemen' || pos && pos === 'D') {
          document.getElementById('defense').className = 'grid defense dragging';
        } else if (type === 'goaltenders' || pos && pos === 'G') {
          document.getElementById('goalies').className = 'grid defense dragging';
        } else {
          document.getElementById('forwards').className = 'grid dragging';
          document.getElementById('defense').className = 'grid defense dragging';
          document.getElementById('goalies').className = 'grid defense dragging';
        }
      } else {
        document.getElementById('forwards').className = 'grid';
        document.getElementById('defense').className = 'grid defense';
        document.getElementById('goalies').className = 'grid defense';
      }
    },
    handleGridDragEnter: function(e) {
      if (dropZoneData.cur) {
        dropZoneData.last = '';
      }
      this.props.benchPlayer = false;
      this.props.addTradePlayer = false;
    },


    // Grid Tiles
    handleTileDragEnter: function(e) {
      e.stopPropagation();
      var dropZone = e.currentTarget;
      if (dropZone.dataset.state !== 'active') {
        dropZone.className = 'tile hover';
        dropZoneData.cur = dropZone;
      }
      dropZoneData.last = dropZone.id;
      this.props.benchPlayer = false;
      this.props.addTradePlayer = false;
    },
    handleTileDragLeave: function(e) {
      var dropZone = e.currentTarget;
      if (dropZone.dataset.state !== 'active') {
        e.currentTarget.className = 'tile';
      }
    },


    // Player Items
    handleMouseDown: function(e) {
      var dragItem   = e.currentTarget,
          playerData = this.state.teamData.players[dragItem.dataset.type][dragItem.dataset.index];
      if (!playerData.actions || playerData.actions && playerData.actions.indexOf('traded') === -1) {
        dragItem.className = 'item clicked';
        this.highlightGrid('on', dragItem.dataset.type, playerData.position);
        this.setState({ curDragPlayer : playerData });
      }
    },
    handleMouseUp: function(e) {
      e.currentTarget.className = 'item hover';
      this.highlightGrid('off');
    },
    handleDragStart: function(e) {
      var dragItem = e.currentTarget;
      dragItem.parentNode.className = dragItem.parentNode.className + ' engaged';
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text', dragItem.id);
      dropZoneData.last = '';
    },
    handleDragEnd: function(e) {
      var dragItem   = e.currentTarget,
          dropZone   = dropZoneData.cur,
          playerData = this.state.teamData.players[dragItem.dataset.type][dragItem.dataset.index],
          rosterData, updateRosterData, capData;

      // Trade Player
      if (this.props.addTradePlayer) {
        if (playerData.team !== this.state.activeTeam ||
            this.state.activeTrade.active.id_list.length === 5 ||
            playerData.status === 'created') {
          dragItem.parentNode.className = dragItem.parentNode.className.replace(' engaged', '');
          dragItem.className = 'item';
          if (playerData.team !== this.state.activeTeam) {
            this.handleTradePlayersError('oneway');
          } else if (this.state.activeTrade.active.id_list.length === 5) {
            this.handleTradePlayersError('maxed');
          } else {
            this.handleTradePlayersError('created');
          }
        } else {
          dragItem.className = 'item';
          playerData.type = dragItem.dataset.type;
          this.handleAddTradePlayer('active', playerData);
        }

      // Add Roster Player
      } else if (dropZone && !dropZone.dataset.state && dropZone.id === dropZoneData.last) {
        dragItem.className = 'item';
        dropZone.className = 'tile active';
        dropZone.dataset.state = 'active';
        playerData.type = dragItem.dataset.type;
        rosterData = this.state.rosterData;
        rosterData[dropZone.id] = playerData;
        capData = this.updateCapStats('add', playerData.contract[0]);
        updateRosterData = React.addons.update(this.state, {
          activePlayers : { $push: [playerData.id] },
          rosterData    : { $set: rosterData },
          rosterInfo    : { hit   : { $set: capData.hit },
                            space : { $set: capData.space }}
        });
        this.setState(updateRosterData);
      } else {
        dragItem.parentNode.className = dragItem.parentNode.className.replace(' engaged', '');
        dragItem.className = 'item';
      }
      this.highlightGrid('off');
      this.props.addTradePlayer = false;
    },


    render: function() {
      return (
        <div id="main">
          <TeamMenu onChangeTeam={this.handleChangeTeam} />
          <div id="app">
            <div className="wrap">
              <Payroll
                teamData={this.state.teamData}
                leagueData={this.state.leagueData} />
              <RosterMenu
                teamData={this.state.teamData}
                leagueData={this.state.leagueData}
                playerData={this.state.playerData}
                rosterInfo={this.state.rosterInfo}
                activeTeam={this.state.activeTeam}
                activeTrade={this.state.activeTrade}
                activePlayers={this.state.activePlayers}
                onRosterSubmit={this.handleRosterSubmit}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onDragStart={this.handleDragStart}
                onDragEnd={this.handleDragEnd}
                onBenchDragEnter={this.handleBenchDragEnter}
                onBenchDragLeave={this.handleBenchDragLeave}
                onTradeDragEnter={this.handleTradeDragEnter}
                onTradeDragLeave={this.handleTradeDragLeave}
                onCreatePlayer={this.handleCreatePlayer}
                onTradeExecution={this.handleTradeExecution}
                onChangeTradeTeam={this.handleChangeTradeTeam}
                onAddTradePlayer={this.handleAddTradePlayer}
                onRemoveTradePlayer={this.handleRemoveTradePlayer} />
              <Roster
                dragging={this.state.dragging}
                leagueData={this.state.leagueData}
                rosterInfo={this.state.rosterInfo}
                rosterData={this.state.rosterData}
                clearRosterData={this.clearRosterData}
                activePlayers={this.state.activePlayers}
                curDragPlayer={this.state.curDragPlayer}
                onGridDragEnter={this.handleGridDragEnter}
                onTileDragEnter={this.handleTileDragEnter}
                onTileDragLeave={this.handleTileDragLeave}
                onPlayerMouseOver={this.handlePlayerMouseOver}
                onPlayerMouseOut={this.handlePlayerMouseOut}
                onPlayerMouseDown={this.handlePlayerMouseDown}
                onPlayerMouseUp={this.handlePlayerMouseUp}
                onPlayerDragStart={this.handlePlayerDragStart}
                onPlayerDragEnd={this.handlePlayerDragEnd} />
            </div>
          </div>
          <div id="unsupported"><img className="logo" src="img/logo.min.svg"/><p>Mobile Version Coming Soon...</p></div>
          <footer>CapCrunch <span className="version">v0.9.1</span></footer>
        </div>
      );
    }
  });

React.render(<App />, document.body);
