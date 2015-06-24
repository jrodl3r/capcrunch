'use strict';

var Teams = require('../static/teams.js'),
    UI    = require('../ui.js');

var Header = React.createClass({

  getDefaultProps: function() {
    return { teams: Teams };
  },

  getTeamName: function(id) {
    return this.props.teams.filter(function(o) { return o.id === id; })[0].name;
  },

  changeView: function(e) {
    var view = e.currentTarget.getAttribute('data-view');
    if (e.currentTarget.className !== 'active') { e.currentTarget.className = 'clicked'; }
    this.props.changeView(view);
  },

  render: function() {

    return (
      <header>
        <div className="inner">
          <div className="beta-tag">beta <span className="version">0.9.3</span></div>
          <img height="43" width="230" src="img/logo.svg" />
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
                  onClick={this.changeView}><i className="fa fa-tasks"></i>Payroll</a>
              </li>
              <li>
                <a id="roster-link" data-view="roster" className={ this.props.activeView === 'roster' ? 'active' : '' }
                  onClick={this.changeView}><i className="fa fa-trophy"></i>Roster</a>
              </li>
              <li id="tools-link"><a><i className="fa fa-server"></i>Tools</a></li>
              <li>
                <a id="help-link"
                  onMouseOver={ this.props.activeView === 'roster' ? UI.showOnboard : null }
                  onMouseLeave={ this.props.activeView === 'roster' ? UI.hideOnboard : null }>
                  <i className="fa fa-question-circle"></i>Help</a>
              </li>
            </ul>
            <a id="video-demo-link"><i className="fa fa-film"></i>Watch Video Guide</a>
          </nav>
        </div>
      </header>
    );
  }
});

module.exports = Header;
