// Team Select Menu (Header)
// ==================================================
'use strict';

var TeamList = require('../static/teams.js'),
    UI = require('../ui.js');

var TeamMenu = React.createClass({
    getDefaultProps: function() {
      return { teams: TeamList };
    },
    handleChangeTeam: function(e) {
      var team = e.target.value;
      this.props.onChangeTeam(team);
    },
    handleChangeView: function(e) {
      e.preventDefault();
      if (e.currentTarget.className.indexOf('active') === -1) {
        if (e.currentTarget.className.indexOf('payroll') !== -1) {
          UI.updateView('payroll');
          this.props.onChangeView('payroll');
        } else {
          UI.updateView('roster');
          this.props.onChangeView('roster');
        }
      }
    },
    getTeamName: function(id) {
      var team = this.props.teams ? this.props.teams.filter(function(o) { return o.id === id; }) : null;
      return team ? team[0].name : null;
    },
    showTeamsGrid: function() {
      UI.showTeamsGrid();
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
                  <div className="team-select-display" onClick={this.showTeamsGrid}>
                    { this.props.activeTeam ? this.getTeamName(this.props.activeTeam) : '' }
                    <i className="fa fa-caret-up"></i>
                    <i className="fa fa-caret-down"></i>
                  </div>
                  <!--// <select id="team-select" value={this.props.activeTeam}>
                  //   {this.props.teams.map(function(team) {
                  //     return <option key={team.id} value={team.id}>{team.name}</option>;
                  //   })}
                  // </select>-->
                </li>
                <li>
                  <a className={ this.props.activeView === 'payroll' ? 'payroll active' : 'payroll' } onClick={this.handleChangeView}>Payroll</a>
                </li>
                <li>
                  <a className={ this.props.activeView === 'roster' ? 'roster active' : 'roster' } onClick={this.handleChangeView}>Roster</a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
      );
    }
  });

module.exports = TeamMenu;
