// CapCrunch App
// ==================================================
'use strict';

var TeamMenu    = require('./components/team-menu.jsx'),
    Payroll     = require('./components/payroll.jsx'),
    Roster      = require('./components/roster.jsx'),
    RosterMenu  = require('./components/roster-menu.jsx'),
    Socket      = io.connect();


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
          status    : false,
          active    : { id : '', players : [], id_list : [] },
          passive   : { id : '', players : [], id_list : [] }
        }
      };
    },
    getDefaultProps: function() {
      return {
        lastDropZoneId : '',
        curDropZone    : null,
        originDropZone : null,
        benchPlayer    : false,
        addTradePlayer : false
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


    // Notifications
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


    // Data Loading
    loadTeamData: function(data) {
      if (data && data !== 'error') {
        var team_data = data;
        team_data.players.created = [];
        for (var i = 0; i < this.state.leagueData.created.length; i++) {
          if (this.state.leagueData.created[i].team === team_data.id) {
            team_data.players.created.push(this.state.leagueData.created[i]);
          }
        }
        this.setState({ teamData: team_data });
        // TODO Panel Transition Effect
        // TODO Reset Panel Scroll Position
      } else { this.showNotification('error', 'Sorry, There was an error loading that team.'); }
    },
    loadPlayerData: function(data) {
      if (data && data !== 'error') {
        var player_data = data;
        var updatePlayerData = React.addons.update(this.state, {
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
    loadRosterData: function(data) {
      if (data && data !== 'error') {
        var roster_data = data,
            roster_grid = this.state.rosterData;
        var updateRosterInfo = React.addons.update(this.state, {
          rosterInfo    : { name  : { $set: roster_data.name },
                            hit   : { $set: roster_data.hit },
                            space : { $set: roster_data.space }},
          activePlayers : { $set: roster_data.activePlayers },
          leagueData    : { created : { $set: roster_data.created },
                            trades  : { $set: roster_data.trades }}
        });
        this.setState(updateRosterInfo);
        for (var pos in roster_grid) {
          if (roster_data.lines.hasOwnProperty(pos)) {
            roster_grid[pos] = roster_data.lines[pos];
          }
        }
        this.setState({ rosterData : roster_grid });
        document.getElementById('team-select').value = roster_data.activeTeam;
        this.handleChangeTeam(roster_data.activeTeam);
      } else { this.showNotification('error', 'There was an error loading that roster.'); }
    },


    // Team Select
    handleChangeTeam: function(id) {
      Socket.emit('get team', id);
      this.setState({ activeTeam : id });
    },


    // Share Roster
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
        roster_data.trades        = this.state.leagueData.trades;
        roster_data.created       = this.state.leagueData.created;
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


    // Create Player
    handleCreatePlayer: function(player) {
      var new_player = {
        lastname  : player.lastname,
        firstname : player.firstname,
        contract  : player.contract,
        shot      : player.shot,
        jersey    : player.jersey,
        image     : '',
        team      : this.state.activeTeam,
        id        : 9900 + this.state.leagueData.created.length,
        age       : '',
        nation    : '',
        position  : player.position,
        status    : ''
      };
      var updateCreatePlayers = React.addons.update(this.state, {
        teamData   : { players : { created : { $push: [new_player] }}},
        leagueData : { created : { $push: [new_player] }}
      });
      this.setState(updateCreatePlayers);
    },


    // Trade Players
    handleTradeExecution: function(players) {

      //console.log('make trade');
      //console.log('active team: ' + this.state.activeTrade.active.id);
      console.log(this.state.activeTrade.active.players);

    },
    handleChangeTradeTeam: function(id) {
      var updateTradeData = React.addons.update(this.state, {
        activeTrade : { passive : { id : { $set: id }}}
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
          activeTrade : { active : { id      : { $set: this.state.activeTeam },
                                     players : { $push: [player] },
                                     id_list : { $push: [player.id] }}}
        });
        console.log(this.state.activeTrade.active.players);
      }
      // TODO Add Check if added player's active team !== cur Active Team ID
      this.setState(updateTradeData);
    },
    handleRemoveTradePlayer: function(type, id) {
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
            activeTrade : { active : { id      : { $set: '' },
                                       players : { $splice: [[index, 1]] },
                                       id_list : { $splice: [[index, 1]] }}}
          });
        }
        console.log(this.state.activeTrade.active.players);
      }
      this.setState(updateTradeData);
    },
    handleTradeDragEnter: function(e) {
      this.props.addTradePlayer = true;
      if (this.state.activeTrade.active.id_list.length) {
        e.currentTarget.className = 'active hover';
      } else {
        e.currentTarget.className = 'hover';
      }
    },
    handleTradeDragLeave: function(e) {
      if (this.state.activeTrade.active.id_list.length) {
        e.currentTarget.className = 'active';
      } else {
        e.currentTarget.className = '';
      }
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
      e.dataTransfer.setData('text/html', playerItem);
      this.props.originDropZone = playerItem.parentNode;
      this.props.originDropZone.className = 'tile active engaged';
      this.props.benchPlayer = false;
      this.props.addTradePlayer = false;
      this.setState({ curDragPlayer : playerData, dragging : true });
    },
    handlePlayerDragEnd: function(e) {
      var playerItem       = e.currentTarget,
          rosterData       = this.state.rosterData,
          activePlayers    = this.state.activePlayers,
          dropZone         = this.props.curDropZone,
          originDropZoneId = this.props.originDropZone.id,
          updateRosterData, capData, index;

      // Bench Player
      if (this.props.benchPlayer || this.props.addTradePlayer) {
        capData = this.updateCapStats('remove', rosterData[originDropZoneId].contract[0]);
        index   = activePlayers.indexOf(rosterData[originDropZoneId].id);
        rosterData[originDropZoneId] = { status: 'empty' };
        updateRosterData = React.addons.update(this.state, {
          dragging      : { $set: false },
          activePlayers : { $splice: [[index, 1]] },
          rosterData    : { $set: rosterData },
          rosterInfo    : { hit   : { $set: capData.hit },
                            space : { $set: capData.space }}
        });
        this.setState(updateRosterData);
        this.props.originDropZone.className = 'tile';
        this.props.originDropZone.dataset.state = '';

        // Trade Player
        if (this.props.addTradePlayer) {
          this.handleAddTradePlayer('active', this.state.curDragPlayer);
        }
      // Move Player
      } else if (dropZone && !dropZone.dataset.state && dropZone.id === this.props.lastDropZoneId) {
        dropZone.className = 'tile active';
        dropZone.dataset.state = 'active';
        rosterData[originDropZoneId] = { status: 'empty' };
        rosterData[dropZone.id] = this.state.curDragPlayer;
        updateRosterData = React.addons.update(this.state, {
          dragging   : { $set: false },
          rosterData : { $set: rosterData }
        });
        this.setState(updateRosterData);
        this.props.originDropZone.className = 'tile';
        this.props.originDropZone.dataset.state = '';
      } else {
        playerItem.className = 'player active hover';
        this.props.originDropZone.className = 'tile active';
        this.setState({ dragging : false });
      }
      this.props.originDropZone = null;
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
        if (type === 'forwards' || pos && /LW|C|RW/.test(pos)) {
          document.getElementById('forwards').className = 'panel group dragging';
        } else if (type === 'defensemen' || pos && /D/.test(pos)) {
          document.getElementById('defense').className = 'panel group defense dragging';
        } else if (type === 'goaltenders' || pos && /G/.test(pos)) {
          document.getElementById('goalies').className = 'panel group defense dragging';
        } else {
          document.getElementById('forwards').className = 'panel group dragging';
          document.getElementById('defense').className = 'panel group defense dragging';
          document.getElementById('goalies').className = 'panel group defense dragging';
        }
      } else {
        document.getElementById('forwards').className = 'panel group';
        document.getElementById('defense').className = 'panel group defense';
        document.getElementById('goalies').className = 'panel group defense';
      }
    },
    handleGridDragEnter: function(e) {
      if (this.props.curDropZone) {
        this.props.lastDropZoneId = '';
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
        this.props.curDropZone = dropZone;
      }
      this.props.lastDropZoneId = dropZone.id;
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
      dragItem.className = 'item clicked';
      this.highlightGrid('on', dragItem.dataset.type, playerData.position);
      this.setState({ curDragPlayer : playerData });
    },
    handleMouseUp: function(e) {
      e.currentTarget.className = 'item';
      e.currentTarget.parentNode.className = 'row';
      this.highlightGrid('off');
    },
    handleDragStart: function(e) {
      var dragItem = e.currentTarget;
      dragItem.parentNode.className = 'row engaged';
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', dragItem);
      this.props.lastDropZoneId = '';
    },
    handleDragEnd: function(e) {
      var dragItem   = e.currentTarget,
          dropZone   = this.props.curDropZone,
          playerData = this.state.teamData.players[dragItem.dataset.type][dragItem.dataset.index],
          rosterData, updateRosterData, capData;

      // Trade Player
      if (this.props.addTradePlayer) {
        dragItem.parentNode.className = 'row removed';
        dragItem.className = 'item';
        this.handleAddTradePlayer('active', playerData);

      // Add Roster Player
      } else if (dropZone && !dropZone.dataset.state && dropZone.id === this.props.lastDropZoneId) {
        dragItem.parentNode.className = 'row removed';
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
        dragItem.parentNode.className = 'row';
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
                onTradeDragEnter={this.handleTradeDragEnter}
                onTradeDragLeave={this.handleTradeDragLeave}
                onBenchDragEnter={this.handleBenchDragEnter}
                onBenchDragLeave={this.handleBenchDragLeave}
                onCreatePlayer={this.handleCreatePlayer}
                onTradeExecution={this.handleTradeExecution}
                onChangeTradeTeam={this.handleChangeTradeTeam}
                onAddTradePlayer={this.handleAddTradePlayer}
                onRemoveTradePlayer={this.handleRemoveTradePlayer} />
              <Roster
                dragging={this.state.dragging}
                rosterInfo={this.state.rosterInfo}
                rosterData={this.state.rosterData}
                leagueData={this.state.leagueData}
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
          <footer>CapCrunch.io <span className="version">v0.7.5</span></footer>
        </div>
      );
    }
  });

React.render(<App />, document.body);
