// CapCrunch App (React)
// ==================================================
'use strict';

var TeamMenu    = require('./components/team-menu.jsx'),
    Payroll     = require('./components/payroll.jsx'),
    Roster      = require('./components/roster.jsx'),
    RosterMenu  = require('./components/roster-menu.jsx'),
    Version     = '0.4.0',
    Socket      = io.connect();


var App = React.createClass({
    getInitialState: function() {
      Socket.on('load team', this.loadTeam);

      return {
        activeTeam: '',
        teamData: {
          id: 'XXX',
          name: 'Team Name',
          cap: { hit: '9.999', space: '9.999', forwards: '9.999', defensemen: '9.999', goaltenders: '9.999', other: '9.999', inactive: '9.999' },
          players: {
            forwards: [{ lastname: 'lastname', firstname: 'firstname', contract: ['9.999'], shot: 'L', jersey: '99', image: '' }],
            defensemen: [{ lastname: 'lastname', firstname: 'firstname', contract: ['9.999'], shot: 'L', jersey: '99', image: '' }],
            goaltenders: [{ lastname: 'lastname', firstname: 'firstname', contract: ['9.999'], shot: 'L', jersey: '99', image: '' }],
            other: [{ lastname: 'lastname', firstname: 'firstname', contract: ['9.999']}],
            inactive: [{ lastname: 'lastname', firstname: 'firstname', contract: ['9.999']}]
          }
        }
      };
    },
    getDefaultProps: function() {
      return {};
    },
    handleChangeTeam: function(team_id) {
      this.setState({ activeTeam: team_id });
      Socket.emit('get team', team_id);
    },
    loadTeam: function(team_obj) {
      this.setState({ teamData: team_obj });
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
