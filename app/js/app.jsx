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
        rosterId        : '',
        rosterName      : '',
        rosterData      : {
          F1L           : { state: 'empty' }, F1C: { state: 'empty' }, F1R: { state: 'empty' },
          F2L           : { state: 'empty' }, F2C: { state: 'empty' }, F2R: { state: 'empty' },
          F3L           : { state: 'empty' }, F3C: { state: 'empty' }, F3R: { state: 'empty' },
          F4L           : { state: 'empty' }, F4C: { state: 'empty' }, F4R: { state: 'empty' },
          D1L           : { state: 'empty' }, D1R: { state: 'empty' },
          D2L           : { state: 'empty' }, D2R: { state: 'empty' },
          D3L           : { state: 'empty' }, D3R: { state: 'empty' },
          G1L           : { state: 'empty' }, G1R: { state: 'empty' }
        },
        activeTeam      : '',
        activePlayers   : [],
        teamData        : {
          id            : '',
          name          : '',
          cap           : { hit: '', space: '', forwards: '', defensemen: '', goaltenders: '', other: '', inactive: '' },
          players       : { forwards: [], defensemen: [], goaltenders: [], other: [], inactive: []}
        }
      };
    },
    getDefaultProps: function() {
      return {
        lastDropZoneId : '',
        curDropZone    : null,
        curDragItem    : null,
        curDragPlayer  : null
      };
    },

    // Team Select
    handleChangeTeam: function(id) {
      Socket.emit('get team', id);
      this.setState({ activeTeam: id });
    },
    loadTeamData: function(data) {
      this.setState({ teamData: data });
    },

    // Roster Grid
    handleGridDragEnter: function(e) {
      if (this.props.curDropZone) {
        this.props.lastDropZoneId = '';
        //console.log('grid enter (' + this.props.curDropZone.id + ')');
      }
    },
    handleTileDragEnter: function(e) {
      e.stopPropagation();
      var dropZone = e.currentTarget;
      if (dropZone.dataset.state !== 'active') {
        dropZone.className = 'tile hover';
        this.props.curDropZone = dropZone;
      }
      this.props.lastDropZoneId = dropZone.id;
      //console.log('drag enter (cur: ' + dropZone.id + ' / last: ' + this.props.lastDropZoneId + ')');
    },
    handleTileDragLeave: function(e) {
      var dropZone = e.currentTarget;
      if (dropZone.dataset.state !== 'active') {
        e.currentTarget.className = 'tile';
      }
      //console.log('drag leave (' + this.props.lastDropZoneId + ')');
    },




    handlePlayerMouseDown: function(e) {
      e.currentTarget.className = 'player active clicked';
      this.props.curDragPlayer = this.state.rosterData[e.currentTarget.parentNode.id]; // [XXX: Will break on missed drag]
      this.highlightGrid('on', this.props.curDragPlayer.type, this.props.curDragPlayer.position);
      // ...
      // console.log('player mouse down');
    },
    handlePlayerMouseUp: function(e) {
      e.currentTarget.className = 'player active';
      e.currentTarget.parentNode.className = 'tile active';
      this.props.curDragPlayer = null;
      this.highlightGrid('off');
      // ...
      // console.log('player mouse up');
    },
    handlePlayerDragStart: function(e) {
      var playerItem = e.currentTarget;
      playerItem.parentNode.className = 'tile active engaged';
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', playerItem);
      // ...
      //console.log('player drag start (' + this.props.curDragPlayer.jersey + ' / ' + this.props.curDragPlayer.type + ')');
    },
    handlePlayerDragEnd: function(e) {
      e.currentTarget.className = 'player active';
      e.currentTarget.parentNode.className = 'tile active';

      // if curDropZone is empty...
      // ..remove item from dragStart tile
      // ..update rosterData at both positions
      // ..activePlayers stays the same

      // ..unless dragged back to player panels
      // ..then remove player from rosterData + activePlayers

      this.props.curDragPlayer = null;
      this.highlightGrid('off');
      // ...
      console.log('player drag end');
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



    // Roster Menu
    handleMouseDown: function(e) {
      var dragItem   = e.currentTarget,
          playerData = this.state.teamData.players[dragItem.dataset.type][dragItem.dataset.index];
      dragItem.className = 'item clicked';
      this.highlightGrid('on', dragItem.dataset.type, playerData.position);
      // ...
      console.log('mouse down (' + playerData.jersey + ')');
    },
    handleMouseUp: function(e) {
      e.currentTarget.className = 'item';
      e.currentTarget.parentNode.className = 'row';
      this.highlightGrid('off');
      console.log('mouse up (' + e.currentTarget.dataset.jersey + ')');
    },
    handleDragStart: function(e) {
      var dragItem = e.currentTarget;
      dragItem.parentNode.className = 'row engaged';
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', dragItem);
      this.props.curDragItem = dragItem;
      this.props.lastDropZoneId = '';
      // ...
      //console.log('item drag start');
    },
    handleDragEnd: function(e) {
      var playerData = {},
          dragItem   = e.currentTarget,
          dropZone   = this.props.curDropZone;
      //console.log('drag end: (cur zone: ' + dropZone.id + ' / last zone: ' + this.props.lastDropZoneId + ')');
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
        //console.log('tile filled (' + dragItem.dataset.jersey + ' » ' + dropZone.id + ')');
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
                onDragEnd={this.handleDragEnd} />
              <Roster
                rosterData={this.state.rosterData}
                onGridDragEnter={this.handleGridDragEnter}
                onTileDragEnter={this.handleTileDragEnter}
                onTileDragLeave={this.handleTileDragLeave}
                onPlayerMouseDown={this.handlePlayerMouseDown}
                onPlayerMouseUp={this.handlePlayerMouseUp}
                onPlayerDragStart={this.handlePlayerDragStart}
                onPlayerDragEnd={this.handlePlayerDragEnd} />
            </div>
          </div>
          <footer>CapCrunch.io <span className="version">v0.5.5</span></footer>
        </div>
      );
    }
  });

React.render(<App />, document.body);
