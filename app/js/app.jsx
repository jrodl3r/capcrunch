// CapCrunch App (React)
// ==================================================
'use strict';

var TeamMenu    = require('./components/team-menu.jsx'),
    Payroll     = require('./components/payroll.jsx'),
    Roster      = require('./components/roster.jsx'),
    RosterMenu  = require('./components/roster-menu.jsx'),
    UI          = require('./ui.js'),
    Socket      = io.connect(),
    Version     = '0.4.2';


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
        }
      };
    },
    handleChangeTeam: function(id) {
      Socket.emit('get team', id);
      this.setState({ activeTeam: id });
    },
    loadTeamData: function(data) {
      this.setState({ teamData: data });
    },
    render: function() {
      return (
        <div id="main">
          <TeamMenu onChangeTeam={this.handleChangeTeam} />
          <div id="app">
            <div className="wrap">
              <Payroll teamData={this.state.teamData} />
              <RosterMenu teamData={this.state.teamData} />
              <Roster teamData={this.state.teamData} />
            </div>
          </div>
          <footer>CapCrunch {Version}</footer>
        </div>
      );
    }
  });

React.render(<App />, document.body);

$(document).ready(UI.init);
