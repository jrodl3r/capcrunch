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
        rosterData : {
               F1L : { status : 'empty' }, F1C : { status : 'empty' }, F1R : { status : 'empty' },
               F2L : { status : 'empty' }, F2C : { status : 'empty' }, F2R : { status : 'empty' },
               F3L : { status : 'empty' }, F3C : { status : 'empty' }, F3R : { status : 'empty' },
               F4L : { status : 'empty' }, F4C : { status : 'empty' }, F4R : { status : 'empty' },
               D1L : { status : 'empty' }, D1R : { status : 'empty' },
               D2L : { status : 'empty' }, D2R : { status : 'empty' },
               D3L : { status : 'empty' }, D3R : { status : 'empty' },
               G1L : { status : 'empty' }, G1R : { status : 'empty' }
        },
        teamData   : {
          id       : '',
          name     : '',
          cap      : { hit : '', space : '', forwards : '', defensemen : '', goaltenders : '', other : '', inactive : '' },
          players  : { forwards : [], defensemen : [], goaltenders : [], other : [], inactive : [], created : [] }
        },
        leagueData : {
          cap      : '69.000',
          trades   : [],
          created  : []
        }
      };
    },
    getDefaultProps: function() {
      return {
        lastDropZoneId : '',
        curDropZone    : null,
        originDropZone : null,
        benchPlayer    : false
      };
    },
    componentDidMount: function() {
      if (this.parseRosterURI()) {
        var roster_id = this.parseRosterURI();
        Socket.emit('get roster', roster_id);
      }
      Socket.on('load team', this.loadTeamData);
      Socket.on('load roster', this.loadRosterData);
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

    // Team Select
    handleChangeTeam: function(id) {
      Socket.emit('get team', id);
      this.setState({ activeTeam : id });
    },
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
        // TODO Handle Share Error
        console.log('share error');
      }
    },
    handleRosterSubmit: function(e) {
      e.preventDefault();
      var rosterData = {},
          rosterName = this.state.rosterInfo.name || this.state.teamData.name;
      if (this.state.activePlayers.length > 10) {
        rosterData.name          = rosterName;
        rosterData.hit           = this.state.rosterInfo.hit;
        rosterData.space         = this.state.rosterInfo.space;
        rosterData.activeTeam    = this.state.activeTeam;
        rosterData.activePlayers = this.state.activePlayers;
        rosterData.trades        = this.state.leagueData.trades;
        rosterData.created       = this.state.leagueData.created;
        rosterData.lines         = this.state.rosterData;
        this.showShareDialog('loading');
        setTimeout(function() {
          Socket.emit('save roster', rosterData);
        }, 1000);
      } else { this.showNotification('tip', 'Try adding a few more players to your roster first.'); }
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

    // Transactions
    handleCreatePlayer: function(player) {
      var newPlayer = {
        lastname: player.lastname,
        firstname: player.firstname,
        contract: player.contract,
        shot: player.shot,
        jersey: player.jersey,
        image: '',
        team: this.state.activeTeam,
        id: 9900 + this.state.leagueData.created.length,
        age: '',
        nation: '',
        position: player.position,
        status: ''
      };
      var updateCreatePlayers = React.addons.update(this.state, {
        teamData   : { players : { created : { $push: [newPlayer] }}},
        leagueData : { created : { $push: [newPlayer] }}
      });
      this.setState(updateCreatePlayers);
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
      var playerItem = e.currentTarget;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', playerItem);
      this.props.originDropZone = playerItem.parentNode;
      this.props.originDropZone.className = 'tile active engaged';
      this.props.benchPlayer = false;
      this.state.curDragPlayer = this.state.rosterData[e.currentTarget.parentNode.id];
      this.state.dragging = true;
      this.setState();
    },
    handlePlayerDragEnd: function(e) {
      var playerItem    = e.currentTarget,
          dropZone      = this.props.curDropZone,
          activePlayers = this.state.activePlayers;
      // Bench Player
      if (this.props.benchPlayer) {
        activePlayers.splice(activePlayers.indexOf(this.state.rosterData[this.props.originDropZone.id].id), 1);
        // TODO Add updateCapStats Method
        this.state.rosterInfo.hit = (parseFloat(this.state.rosterInfo.hit) - parseFloat(this.state.rosterData[this.props.originDropZone.id].contract[0])).toFixed(3);
        this.state.rosterInfo.space = (parseFloat(this.state.rosterInfo.space) + parseFloat(this.state.rosterData[this.props.originDropZone.id].contract[0])).toFixed(3);
        this.state.rosterData[this.props.originDropZone.id] = { status: 'empty' };
        this.props.originDropZone.className = 'tile';
        this.props.originDropZone.dataset.state = '';
      // Move Player
      } else if (dropZone && !dropZone.dataset.state && dropZone.id === this.props.lastDropZoneId) {
        dropZone.className = 'tile active';
        dropZone.dataset.state = 'active';
        this.props.originDropZone.className = 'tile';
        this.props.originDropZone.dataset.state = '';
        this.state.rosterData[this.props.originDropZone.id] = { status: 'empty' };
        this.state.rosterData[dropZone.id] = this.state.curDragPlayer;
      } else {
        playerItem.className = 'player active hover';
        this.props.originDropZone.className = 'tile active';
      }
      this.props.originDropZone = null;
      this.props.benchPlayer = false;
      this.highlightGrid('off');
      this.hidePlayerBench();
      this.state.dragging = false;
      this.setState();
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
      this.state.curDragPlayer = playerData;
      this.setState();
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
      var playerData = {},
          dragItem   = e.currentTarget,
          dropZone   = this.props.curDropZone;
      if (dropZone && !dropZone.dataset.state && dropZone.id === this.props.lastDropZoneId) {
        dragItem.parentNode.className = 'row removed';
        dragItem.className = 'item';
        dropZone.className = 'tile active';
        dropZone.dataset.state = 'active';
        playerData = this.state.teamData.players[dragItem.dataset.type][dragItem.dataset.index];
        playerData.type = dragItem.dataset.type;
        // TODO Update Array Mutation
        this.state.activePlayers.push(playerData.id);
        this.state.rosterData[dropZone.id] = playerData;
        // TODO Add updateCapStats Method
        this.state.rosterInfo.hit = (parseFloat(this.state.rosterInfo.hit) + parseFloat(playerData.contract[0])).toFixed(3);
        this.state.rosterInfo.space = (parseFloat(this.state.rosterInfo.space) - parseFloat(playerData.contract[0])).toFixed(3);
        this.setState();
      } else {
        dragItem.className = 'item';
        dragItem.parentNode.className = 'row';
      }
      this.highlightGrid('off');
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
                rosterInfo={this.state.rosterInfo}
                activePlayers={this.state.activePlayers}
                onRosterSubmit={this.handleRosterSubmit}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onDragStart={this.handleDragStart}
                onDragEnd={this.handleDragEnd}
                onBenchDragEnter={this.handleBenchDragEnter}
                onBenchDragLeave={this.handleBenchDragLeave}
                onCreatePlayer={this.handleCreatePlayer} />
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
          <footer>CapCrunch.io <span className="version">v0.7.2</span></footer>
        </div>
      );
    }
  });

React.render(<App />, document.body);
