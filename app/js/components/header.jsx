// Header
// ==================================================
'use strict';

var Teams = require('../static/teams.js');

var Header = React.createClass({
    componentDidMount: function() {
      document.getElementById('team-select').addEventListener('click', this.changeView);
      document.getElementById('payroll-link').addEventListener('click', this.changeView);
      document.getElementById('roster-link').addEventListener('click', this.changeView);
    },
    getDefaultProps: function() {
      return { teams: Teams };
    },
    getTeamName: function(id) {
      var team = this.props.teams ? this.props.teams.filter(function(o) { return o.id === id; }) : null;
      return team ? team[0].name : null;
    },
    changeView: function(e) {
      var view = e.currentTarget.dataset.view;
      this.props.onChangeView(view);
    },

    render: function() {

      return (
        <header>
          <div className="inner">
            <div className="beta-tag">beta <span className="version">0.9.2</span></div>
            <img className="logo" src="img/logo.min.svg"/>
            <div id="notify"></div>
            <nav id="team-menu" className={ this.props.activeView === 'roster' || this.props.activeView === 'payroll' ? 'active' : null }>
              <ul>
                <li>
                  <div id="team-select" data-view="teams">
                    { this.props.activeTeam ? this.getTeamName(this.props.activeTeam) : 'Select Team' }
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
                  <a id="payroll-link" data-view="payroll" className={ this.props.activeView === 'payroll' ? 'active' : null }>Payroll</a>
                </li>
                <li>
                  <a id="roster-link" data-view="roster" className={ this.props.activeView === 'roster' ? 'active' : null }>Roster</a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
      );
    }
  });

module.exports = Header;
