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
        activeTeam : '',
        teamData   : {
          id       : '',
          name     : '',
          cap      : { hit: '', space: '', forwards: '', defensemen: '', goaltenders: '', other: '', inactive: '' },
          players  : {
            forwards    : [{ lastname: '', firstname: '', contract: [''], shot: '', jersey: '', image: '' }],
            defensemen  : [{ lastname: '', firstname: '', contract: [''], shot: '', jersey: '', image: '' }],
            goaltenders : [{ lastname: '', firstname: '', contract: [''], shot: '', jersey: '', image: '' }],
            other       : [{ lastname: '', firstname: '', contract: ['']}],
            inactive    : [{ lastname: '', firstname: '', contract: ['']}]
          }
        },
        rosterId   : '',
        rosterName : '',
        rosterData : {
          F1L : { state: 'empty' }, F1C: { state: 'empty' }, F1R: { state: 'empty' },
          F2L : { state: 'empty' }, F2C: { state: 'empty' }, F2R: { state: 'empty' },
          F3L : { state: 'empty' }, F3C: { state: 'empty' }, F3R: { state: 'empty' },
          F4L : { state: 'empty' }, F4C: { state: 'empty' }, F4R: { state: 'empty' },
          D1L : { state: 'empty' }, D1R: { state: 'empty' },
          D2L : { state: 'empty' }, D2R: { state: 'empty' },
          D3L : { state: 'empty' }, D3R: { state: 'empty' },
          G1L : { state: 'empty' }, G1R: { state: 'empty' }
          //F1: { lastname: 'Benyhanna', firstname: 'Fubu', contract: '0.000', shot: 'R', jersey: '36', image: 'http://img.capcrunch.io/players/Kaleta-Patrick.png' },
        }
      };
    },
    getDefaultProps: function() {
      return {
        lastDropZoneId : '',
        curDropZone    : null,
        curDragItem    : null
      };
    },
    handleChangeTeam: function(id) {
      Socket.emit('get team', id);
      this.setState({ activeTeam: id });
    },
    loadTeamData: function(data) {
      this.setState({ teamData: data });
    },

    // Roster Grid
    handleDragEnter: function(e) {
      var dropZone = e.currentTarget;
      if (!dropZone.dataset.state) {
        dropZone.className = 'tile hover';
        this.props.curDropZone = dropZone;
      }
      this.props.lastDropZoneId = '';
      //console.log('drag enter (' + dropZone.id + ')');
    },
    handleDragLeave: function(e) {
      var lastDropZone = e.currentTarget;
      lastDropZone.className = 'tile';
      setTimeout(function() {
        this.props.lastDropZoneId = lastDropZone.id;
        //console.log('drag leave (' + this.props.lastDropZoneId + ')');
      }.bind(this), 100);
    },

    // Roster Menu
    handleMouseDown: function(e) {
      e.currentTarget.className = 'item clicked';
      //console.log('mouse down');
    },
    handleMouseUp: function(e) {
      e.currentTarget.className = 'item';
      e.currentTarget.parentNode.className = 'row';
      //console.log('mouse up');
    },
    handleDragStart: function(e) {
      var dragItem = e.currentTarget;
      dragItem.parentNode.className = 'row engaged';
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', dragItem);
      this.props.curDragItem = dragItem;
      this.props.lastDropZoneId = '';
      //console.log('drag start (' + this.props.lastDropZoneId + ')');
    },
    handleDragEnd: function(e) {
      var dragData = {},
          dragItem = e.currentTarget,
          dropZone = this.props.curDropZone;
      //console.log(dropZone.id, this.props.lastDropZoneId);
      if (!dropZone.dataset.state && dropZone.id !== this.props.lastDropZoneId) {
        dragItem.parentNode.className = 'row removed';
        dropZone.dataset.state = 'active';
        dragData = {
          lastname  : dragItem.dataset.lastname,
          firstname : dragItem.dataset.firstname,
          contract  : dragItem.dataset.contract,
          shot      : dragItem.dataset.shot,
          jersey    : dragItem.dataset.jersey,
          image     : dragItem.dataset.image
        };
        this.state.rosterData[dropZone.id] = dragData;
        this.setState();
        //console.log('tile filled (' + dragItem.dataset.id + ')');
      } else {
        dragItem.className = 'item';
        dragItem.parentNode.className = 'row';
        //console.log('tile not filled');
      }
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
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onDragStart={this.handleDragStart}
                onDragEnd={this.handleDragEnd} />
              <Roster
                rosterData={this.state.rosterData}
                onDragEnter={this.handleDragEnter}
                onDragLeave={this.handleDragLeave} />
            </div>
          </div>
          <footer>CapCrunch.io <span className="version">v0.4.4</span></footer>
        </div>
      );
    }
  });

React.render(<App />, document.body);
