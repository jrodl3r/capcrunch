'use strict';

var Teams = require('../static/teams.js'),

TeamGrid = React.createClass({

  shouldComponentUpdate: function(nextProps) {
    return this.props.activeView !== nextProps.activeView;
  },

  getDefaultProps: function() {
    return { teams: Teams };
  },

  changeTeam: function(e) {
    this.props.changeTeam(e.currentTarget.getAttribute('data-team'));
  },

  render: function() {

    return (
      <div id="teams" className={ this.props.activeView === 'teams' ? 'active' : '' }>
        <div className="inner">
          <div id="grid-reminder"></div>
          <object id="grid-svg" data="img/team-select-grid.svg" type="image/svg+xml"></object>
          <div id="team-grid">
            { this.props.teams.map(function(team) {
              return (
                <div key={team.id} data-team={team.id} className={team.id} onClick={this.changeTeam}>
                  { this.props.activeTeam === team.id ? <div className="active-team-marker inactive"></div> : null }
                </div>
              );
            }.bind(this)) }
          </div>
        </div>
      </div>
    );
  }
});

module.exports = TeamGrid;
