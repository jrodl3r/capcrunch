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
      Socket.on('load team', this.loadTeamData);
      return {
        activeTeam      : '',
        activePlayers   : [],
        rosterId        : '',
        rosterName      : '',
        rosterData      : {
          F1L: {}, F1C: {}, F1R: {},
          F2L: {}, F2C: {}, F2R: {},
          F3L: {}, F3C: {}, F3R: {},
          F4L: {}, F4C: {}, F4R: {},
          D1L: {}, D1R: {},
          D2L: {}, D2R: {},
          D3L: {}, D3R: {},
          G1L: {}, G1R: {}
        },
        teamData        : {
          id            : '',
          name          : '',
          cap           : { hit: '', space: '', forwards: '', defensemen: '', goaltenders: '', other: '', inactive: '' },
          players       : { forwards: [], defensemen: [], goaltenders: [], other: [], inactive: [] }
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

    // Team Select
    handleChangeTeam: function(id) {
      Socket.emit('get team', id);
      this.setState({ activeTeam: id });
    },
    loadTeamData: function(data) {
      this.setState({ teamData: data });
      // [TODO: Add Panel Transition Fade-In/Out Effect]
      // [TODO: Reset Panel Scroll Position]
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
        //console.log('grid enter (' + this.props.curDropZone.id + ')');
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
      //console.log('drag enter (cur: ' + dropZone.id + ' / last: ' + this.props.lastDropZoneId + ')');
    },
    handleTileDragLeave: function(e) {
      var dropZone = e.currentTarget;
      if (dropZone.dataset.state !== 'active') {
        e.currentTarget.className = 'tile';
      }
      //console.log('drag leave (' + this.props.lastDropZoneId + ')');
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
      //console.log('player drag start (' + this.props.curDragPlayer.jersey + ' / ' + this.props.curDragPlayer.type + ')');
    },
    handlePlayerDragEnd: function(e) {
      var playerItem    = e.currentTarget,
          dropZone      = this.props.curDropZone,
          activePlayers = this.state.activePlayers;
      //console.log('player drag end: (' + this.props.curDragPlayer.id + ' on ' + dropZone.id + ')');
      if (this.props.benchPlayer) {
        activePlayers.splice(activePlayers.indexOf(this.state.rosterData[this.props.originDropZone.id].id), 1);
        this.state.rosterData[this.props.originDropZone.id] = {};
        this.setState();
        playerItem.parentNode.className = 'tile';
        playerItem.parentNode.dataset.state = '';
        console.log('player benched');
      } else if (dropZone && !dropZone.dataset.state && dropZone.id === this.props.lastDropZoneId) {
        playerItem.parentNode.className = 'tile';
        dropZone.className = 'tile active';
        dropZone.dataset.state = 'active';
        this.props.originDropZone.dataset.state = '';
        this.state.rosterData[this.props.originDropZone.id] = {};
        this.state.rosterData[dropZone.id] = this.props.curDragPlayer;
        this.setState();
        //console.log('moved player (' + this.props.curDragPlayer.jersey + ' to ' + dropZone.id + ')');
      } else {
        playerItem.className = 'player active hover';
        playerItem.parentNode.className = 'tile active';
        //console.log('no player movement');
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
    handleBenchDragEnter: function() {
      this.props.benchPlayer = true;
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
      //console.log('item drag start');
    },
    handleDragEnd: function(e) {
      var playerData = {},
          dragItem   = e.currentTarget,
          dropZone   = this.props.curDropZone;
      //console.log('drag end: (cur: ' + dropZone.id + ', last: ' + this.props.lastDropZoneId + ')');
      if (dropZone && !dropZone.dataset.state && dropZone.id === this.props.lastDropZoneId) {
        dragItem.parentNode.className = 'row removed';
        dragItem.className = 'item';
        dropZone.className = 'tile active';
        dropZone.dataset.state = 'active';
        playerData = this.state.teamData.players[dragItem.dataset.type][dragItem.dataset.index];
        playerData.type = dragItem.dataset.type;
        this.state.activePlayers.push(playerData.id);
        this.state.rosterData[dropZone.id] = playerData;
        this.setState();
        //console.log('tile filled (' + dropZone.id + ')');
      } else {
        dragItem.className = 'item';
        dragItem.parentNode.className = 'row';
        //console.log('no tile action');
      }
      this.highlightGrid('off');
    },

    render: function() {
      return (
        <div id="main">
          <TeamMenu onChangeTeam={this.handleChangeTeam} />
          <div id="app">
            <div className="wrap">
              <Payroll teamData={this.state.teamData} />
              <RosterMenu
                teamData={this.state.teamData}
                activePlayers={this.state.activePlayers}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onDragStart={this.handleDragStart}
                onDragEnd={this.handleDragEnd}
                onBenchDragEnter={this.handleBenchDragEnter}
                onBenchDragLeave={this.handleBenchDragLeave} />
              <Roster
                rosterData={this.state.rosterData}
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
          <footer>CapCrunch.io <span className="version">v0.5.6</span></footer>
        </div>
      );
    }
  });

React.render(<App />, document.body);
