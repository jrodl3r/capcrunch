'use strict';

var Teams = require('../static/teams.js'),

Header = React.createClass({

  getDefaultProps: function() {
    return { teams: Teams };
  },

  getTeamName: function(id) {
    return this.props.teams.filter(function(o) { return o.id === id; })[0].name;
  },

  changeView: function(e) {
    var view = e.currentTarget.getAttribute('data-view');
    this.props.changeView(view);
  },

  render: function() {

    return (
      <header>
        <div className="inner unloaded">
          <div className="beta-tag">beta <span className="version">0.9.2</span></div>
          <img src="img/logo.svg" />
          <div id="notify" className={ this.props.notify.label ? 'active ' + this.props.notify.label : '' }>{this.props.notify.msg}</div>
          <nav id="team-menu" className={ this.props.activeView === 'roster' || this.props.activeView === 'payroll' ? 'active' : '' }>
            <ul>
              <li>
                <div id="team-select" data-view="teams" onClick={this.changeView}>
                  { this.props.activeTeam ? this.getTeamName(this.props.activeTeam) : 'Select Team' }
                  <i className="fa fa-th"></i>
                </div>
              </li>
              <li>
                <a id="payroll-link" data-view="payroll" className={ this.props.activeView === 'payroll' ? 'active' : '' }
                  onClick={this.changeView}>Payroll</a>
              </li>
              <li>
                <a id="roster-link" data-view="roster" className={ this.props.activeView === 'roster' ? 'active' : '' }
                  onClick={this.changeView}>Roster</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    );
  }
});

module.exports = Header;
