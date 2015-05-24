'use strict';

var Teams = require('../static/teams.js'),

TeamGrid = React.createClass({

  componentDidMount: function() {
    setTimeout(function() {
      document.getElementById('grid-reminder').className = 'active';
    }, 1);
  },
  getDefaultProps: function() {
    return { teams: Teams };
  },
  changeTeam: function(e) {
    var team = e.currentTarget.className;
    this.props.changeTeam(team);
  },

  render: function() {

    return (
      <div id="teams" className={ this.props.activeView === 'teams' ? 'active' : '' }>
        <div className="inner unloaded">
          <div id="grid-reminder" className={ this.props.activeTeam ? 'disabled' : '' }></div>
          <object id="grid-svg" data="img/team-select-grid.svg" type="image/svg+xml"></object>
          <div className="grid">
            {this.props.teams.map(function(team) {
              return <div key={team.id} className={team.id} onClick={this.changeTeam}></div>;
            }.bind(this))}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = TeamGrid;
