// CapCrunch Team Select Menu / Header (Component)
// ==================================================
'use strict';

var TeamList = require('../static/teams.js'),
    UI = require('../ui.js');

var TeamMenu = React.createClass({
    getDefaultProps: function() {
      return { teams: TeamList };
    },
    handleChangeTeam: function(e) {
      var team_id = e.target.value;
      this.props.onChangeTeam(team_id);
    },
    handleChangeView: function(e) {
      var link = e.currentTarget.className;
      e.preventDefault();
      if (link.indexOf('active') === -1) {
        if (link.indexOf('payroll') !== -1) {
          if (!this.props.activeTeam) {
            // show team-select reminder
            document.getElementById('team-select-reminder').className = 'active';
          } else {
            // show payroll
            UI.updateView('payroll');
            this.props.onChangeView('payroll');
          }
        } else if (link.indexOf('roster') !== -1) {
          // show roster
          UI.updateView('roster');
          this.props.onChangeView('roster');
        }
      }
    },
    hideReminder: function() {
      document.getElementById('team-select-reminder').className = '';
    },

    render: function() {
      return (
        <header>
          <div className="inner">
            <div className="beta-tag">beta <span className="version">0.9.2</span></div>
            <img className="logo" src="img/logo.min.svg"/>
            <div id="notify"></div>
            <nav id="team-menu">
              <ul>
                <li>
                  <select id="team-select" defaultValue="0" onClick={this.hideReminder} onChange={this.handleChangeTeam}>
                    <option value="0" disabled>Select Team</option>
                    {this.props.teams.map(function(team) {
                      return <option key={team.id} value={team.id}>{team.name}</option>;
                    })}
                  </select>
                </li>
                <li>
                  <a className={ this.props.activeView === 'payroll' ? 'payroll active' : 'payroll' } onClick={this.handleChangeView}>Payroll</a>
                </li>
                <li>
                  <a className={ this.props.activeView === 'roster' ? 'roster active' : 'roster' } onClick={this.handleChangeView}>Roster</a>
                </li>
              </ul>
              <div id="team-select-reminder"></div>
            </nav>
          </div>
        </header>
      );
    }
  });

module.exports = TeamMenu;
