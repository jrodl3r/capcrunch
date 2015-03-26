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
        activeTeam: '',
        teamData: {
          id: '',
          name: '',
          cap: { hit: '', space: '', forwards: '', defensemen: '', goaltenders: '', other: '', inactive: '' },
          players: {
            forwards: [{ lastname: '', firstname: '', contract: [''], shot: '', jersey: '', image: '' }],
            defensemen: [{ lastname: '', firstname: '', contract: [''], shot: '', jersey: '', image: '' }],
            goaltenders: [{ lastname: '', firstname: '', contract: [''], shot: '', jersey: '', image: '' }],
            other: [{ lastname: '', firstname: '', contract: ['']}],
            inactive: [{ lastname: '', firstname: '', contract: ['']}]
          }
        },
        rosterData: {
          id: '',
          name: '',
          lineup: {
            F1: [{ lastname: '', firstname: '', contract: '', shot: '', jersey: '', image: '' }],
            F2: [{ lastname: '', firstname: '', contract: '', shot: '', jersey: '', image: '' }],
            F3: [{ lastname: '', firstname: '', contract: '', shot: '', jersey: '', image: '' }],
            F4: [{ lastname: '', firstname: '', contract: '', shot: '', jersey: '', image: '' }],
            D1: [{ lastname: '', firstname: '', contract: '', shot: '', jersey: '', image: '' }],
            D2: [{ lastname: '', firstname: '', contract: '', shot: '', jersey: '', image: '' }],
            D3: [{ lastname: '', firstname: '', contract: '', shot: '', jersey: '', image: '' }],
            G1: [{ lastname: '', firstname: '', contract: '', jersey: '', image: '' }]
          }
        }
      };
    },
    getDefaultProps: function() {
      return {
        curDragTarget: null,
        draggedPlayer: null
      };
    },
    // Team Select Menu
    handleChangeTeam: function(id) {
      Socket.emit('get team', id);
      this.setState({ activeTeam: id });
    },
    loadTeamData: function(data) {
      this.setState({ teamData: data });
    },
    // Roster Grid
    // handleDragOver: function(e) {},
    handleDragEnter: function(e) {
      if (e.currentTarget.dataset.state !== 'full') {
        e.currentTarget.className = 'tile hover';
        this.props.curDragTarget = e.currentTarget;
      }
    },
    handleDragLeave: function(e) {
      if (e.currentTarget.dataset.state !== 'full') {
        e.currentTarget.className = 'tile';
      }
    },
    // Roster Menu
    handleMouseDown: function(e) {
      e.currentTarget.className = 'item dragging';
    },
    handleMouseUp: function(e) {
      //if (!this.props.draggedPlayer) {
      e.currentTarget.className = 'item';
      e.currentTarget.parentNode.className = 'row';
      //}
    },
    handleDragStart: function(e) {
      this.props.draggedPlayer = e.currentTarget;
      this.props.draggedPlayer.parentNode.className = 'row engaged';
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', e.currentTarget);
      //console.log('drag start');
    },
    handleDragEnd: function(e) {
      if (this.props.curDragTarget && this.props.curDragTarget.dataset.state !== 'full') {
        e.currentTarget.parentNode.className = 'row removed';
        this.props.curDragTarget.dataset.state = 'full';
        // ...
        this.props.curDragTarget.innerHTML = e.currentTarget.dataset.id;
        // ...
      } else {
        this.props.draggedPlayer.className = 'item';
        this.props.draggedPlayer.parentNode.className = 'row';
      }
      this.props.draggedPlayer = null;
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
                teamData={this.state.rosterData}
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
