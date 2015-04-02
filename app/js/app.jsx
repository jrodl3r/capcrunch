// CapCrunch App (React)
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
        activeTeam    : '',
        activePlayers : [],
        rosterInfo    : {
          id          : '',
          name        : '',
          hit         : '0.000',
          space       : '69.000'
        },
        rosterData    : {
          F1L : {}, F1C : {}, F1R : {},
          F2L : {}, F2C : {}, F2R : {},
          F3L : {}, F3C : {}, F3R : {},
          F4L : {}, F4C : {}, F4R : {},
          D1L : {}, D1R : {},
          D2L : {}, D2R : {},
          D3L : {}, D3R : {},
          G1L : {}, G1R : {}
        },
        teamData   : {
          id       : '',
          name     : '',
          cap      : { hit: '', space: '', forwards: '', defensemen: '', goaltenders: '', other: '', inactive: '' },
          players  : { forwards: [], defensemen: [], goaltenders: [], other: [], inactive: [] }
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
        curDragItem    : null,
        curDragPlayer  : null,
        originDropZone : null,
        benchPlayer    : false
      };
    },
    componentDidMount: function() {
      Socket.on('load team', this.loadTeamData);
      Socket.on('load roster', this.loadRosterData);
      Socket.on('roster saved', this.showShareModal);
      if (this.parseRosterURI()) {
        Socket.emit('get roster', this.state.rosterInfo.id);
      }
    },

    // Team Select
    handleChangeTeam: function(id) {
      Socket.emit('get team', id);
      this.setState({ activeTeam: id });
    },
    loadTeamData: function(data) {
      if (data !== 'error') {
        this.setState({ teamData: data });
      } else {
        console.log('Load Team ERROR');
        // TODO HandleLoadTeamError
      }
      // TODO Panel Transition Effect
      // TODO Reset Panel Scroll Position
    },

    // Share Roster
    showShareModal: function(roster_id) {
      console.log('roster saved: ' + roster_id);
    },
    handleRosterSubmit: function(e) {
      e.preventDefault();
      var rosterData = {},
          rosterName = this.state.rosterInfo.name || this.state.teamData.name;
      rosterData.name = rosterName;
      rosterData.activeTeam = this.state.activeTeam;
      rosterData.activePlayers = this.state.activePlayers;
      rosterData.trades = this.state.leagueData.trades;
      rosterData.created = this.state.leagueData.created;
      rosterData.lines  = this.state.rosterData;
      Socket.emit('save roster', rosterData);
    },
    parseRosterURI: function() {
      var roster_id = decodeURI(location.pathname.substr(1));
      if (roster_id) {
        this.state.rosterInfo.id = roster_id;
        this.setState();
        return true;
      } else { return false; }
    },
    loadRosterData: function(data) {
      if (data !== 'error') {
        console.log('load roster: ' + data.name);
        //this.setState({ rosterData: data });

        // TODO Update Roster + UI

      } else {
        console.log('Load Roster ERROR');
        // TODO HandleLoadRosterError
      }
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

    // Roster Tiles
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

    // Roster Players
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
      e.currentTarget.className = 'player active clicked';
      this.props.curDragPlayer = this.state.rosterData[e.currentTarget.parentNode.id];
      this.highlightGrid('on', this.props.curDragPlayer.type, this.props.curDragPlayer.position);
      this.showPlayerBench();
    },
    handlePlayerMouseUp: function(e) {
      e.currentTarget.className = 'player active';
      e.currentTarget.parentNode.className = 'tile active';
      this.props.curDragPlayer = null;
      this.highlightGrid('off');
      this.hidePlayerBench();
    },
    handlePlayerDragStart: function(e) {
      var playerItem = e.currentTarget;
      playerItem.parentNode.className = 'tile active engaged';
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', playerItem);
      this.props.originDropZone = playerItem.parentNode;
      this.props.benchPlayer = false;
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
        this.state.rosterData[this.props.originDropZone.id] = {};
        this.setState();
        playerItem.parentNode.className = 'tile';
        playerItem.parentNode.dataset.state = '';
      // Move Player
      } else if (dropZone && !dropZone.dataset.state && dropZone.id === this.props.lastDropZoneId) {
        playerItem.parentNode.className = 'tile';
        dropZone.className = 'tile active';
        dropZone.dataset.state = 'active';
        this.props.originDropZone.dataset.state = '';
        this.state.rosterData[this.props.originDropZone.id] = {};
        this.state.rosterData[dropZone.id] = this.props.curDragPlayer;
        this.setState();
      // Undo Move
      } else {
        playerItem.className = 'player active hover';
        playerItem.parentNode.className = 'tile active';
      }
      this.props.curDragPlayer = null;
      this.props.originDropZone = null;
      this.props.benchPlayer = false;
      this.highlightGrid('off');
      this.hidePlayerBench();
    },

    // Bench Player
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

    // Roster Menu
    handleMouseDown: function(e) {
      var dragItem   = e.currentTarget,
          playerData = this.state.teamData.players[dragItem.dataset.type][dragItem.dataset.index];
      dragItem.className = 'item clicked';
      this.highlightGrid('on', dragItem.dataset.type, playerData.position);
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
      this.props.curDragItem = dragItem;
      this.props.lastDropZoneId = '';
    },
    handleDragEnd: function(e) {
      var playerData = {},
          dragItem   = e.currentTarget,
          dropZone   = this.props.curDropZone;
      // Add Player
      if (dropZone && !dropZone.dataset.state && dropZone.id === this.props.lastDropZoneId) {
        dragItem.parentNode.className = 'row removed';
        dragItem.className = 'item';
        dropZone.className = 'tile active';
        dropZone.dataset.state = 'active';
        playerData = this.state.teamData.players[dragItem.dataset.type][dragItem.dataset.index];
        playerData.type = dragItem.dataset.type;
        this.state.activePlayers.push(playerData.id);
        this.state.rosterData[dropZone.id] = playerData;
        // TODO Add updateCapStats Method
        this.state.rosterInfo.hit = (parseFloat(this.state.rosterInfo.hit) + parseFloat(playerData.contract[0])).toFixed(3);
        this.state.rosterInfo.space = (parseFloat(this.state.rosterInfo.space) - parseFloat(playerData.contract[0])).toFixed(3);
        this.setState();
      // Undo Add
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
                onBenchDragLeave={this.handleBenchDragLeave} />
              <Roster
                rosterInfo={this.state.rosterInfo}
                rosterData={this.state.rosterData}
                leagueData={this.state.leagueData}
                activePlayers={this.state.activePlayers}
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
          <footer>CapCrunch.io <span className="version">v0.6.1</span></footer>
        </div>
      );
    }
  });

React.render(<App />, document.body);
