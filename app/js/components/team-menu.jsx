// CapCrunch Team Select Menu / Header (Component)
// ==================================================
'use strict';

var TeamList = require('../static/teams.js');

var TeamMenu = React.createClass({
    getDefaultProps: function() {
      return { teams: TeamList };
    },
    handleChangeTeam: function(e) {
      var team_id = e.target.value;
      this.props.onChangeTeam(team_id);
    },
    render: function() {
      return (
        <header>
          <div className="inner">
            <img className="logo" src="img/logo.min.svg"/>
            <div id="notify"></div>
            <nav id="team-menu">
              <ul>
                <li>
                  <select id="team-select" defaultValue="0" onChange={this.handleChangeTeam}>
                    <option value="0" disabled>Select Team</option>
                    {this.props.teams.map(function(team) {
                      return <option key={team.id} value={team.id}>{team.name}</option>;
                    })}
                  </select>
                </li>
                <li><a href="#" className="payroll">Payroll</a></li>
                <li><a href="#" className="roster active">Roster</a></li>
              </ul>
              <div id="team-select-reminder"></div>
            </nav>
          </div>
        </header>
      );
    }
  });

module.exports = TeamMenu;
