// CapCrunch Team Select Header Menu (Component)
// ==================================================
'use strict';

var Teams = require('../static/teams.js');


var TeamMenu = React.createClass({
    getDefaultProps: function() {
      return { teams: Teams };
    },
    handleChangeTeam: function(e) {
      var team_id = e.target.value;
      this.props.onChangeTeam(team_id);
    },
    render: function() {
      return (
        <header>
          <div className="inner">
            <h1>CapCrunch</h1>
            <nav id="team-menu">
              <ul>
                <li>
                  <select id="team-select" onChange={this.handleChangeTeam}>
                    <option selected disabled>Select Team</option>
                    {this.props.teams.map(function(team) {
                      return <option value={team.id}>{team.name}</option>;
                    })}
                  </select>
                </li>
                <!-- TODO -->
                <li><a href="#" className="payroll">Payroll</a></li>
                <li><a href="#" className="roster active">Roster</a></li>
              </ul>
            </nav>
          </div>
        </header>
      );
    }
  });

module.exports = TeamMenu;
