// Team Select Grid
// ==================================================
'use strict';

var TeamGrid = React.createClass({
    handleChangeTeam: function(e) {
      var team = e.currentTarget.className;
      this.props.onChangeTeam(team);
    },

    render: function() {

      return (
        <div id="teams">
          <div className="inner">
            <div id="grid-reminder"></div>
            <object id="grid-svg" data="../img/team-select-grid.svg" type="image/svg+xml"></object>
            <div className="grid">
              <div className="ANA" onClick={this.handleChangeTeam}></div>
              <div className="ARI" onClick={this.handleChangeTeam}></div>
              <div className="BOS" onClick={this.handleChangeTeam}></div>
              <div className="BUF" onClick={this.handleChangeTeam}></div>
              <div className="CGY" onClick={this.handleChangeTeam}></div>
              <div className="CAR" onClick={this.handleChangeTeam}></div>
              <div className="CHI" onClick={this.handleChangeTeam}></div>
              <div className="CLB" onClick={this.handleChangeTeam}></div>
              <div className="COL" onClick={this.handleChangeTeam}></div>
              <div className="DAL" onClick={this.handleChangeTeam}></div>
              <div className="DET" onClick={this.handleChangeTeam}></div>
              <div className="EDM" onClick={this.handleChangeTeam}></div>
              <div className="FLA" onClick={this.handleChangeTeam}></div>
              <div className="LAK" onClick={this.handleChangeTeam}></div>
              <div className="MIN" onClick={this.handleChangeTeam}></div>
              <div className="MTL" onClick={this.handleChangeTeam}></div>
              <div className="NJD" onClick={this.handleChangeTeam}></div>
              <div className="NAS" onClick={this.handleChangeTeam}></div>
              <div className="NYI" onClick={this.handleChangeTeam}></div>
              <div className="NYR" onClick={this.handleChangeTeam}></div>
              <div className="OTT" onClick={this.handleChangeTeam}></div>
              <div className="PHI" onClick={this.handleChangeTeam}></div>
              <div className="PIT" onClick={this.handleChangeTeam}></div>
              <div className="SJS" onClick={this.handleChangeTeam}></div>
              <div className="STL" onClick={this.handleChangeTeam}></div>
              <div className="TBL" onClick={this.handleChangeTeam}></div>
              <div className="TOR" onClick={this.handleChangeTeam}></div>
              <div className="VAN" onClick={this.handleChangeTeam}></div>
              <div className="WAS" onClick={this.handleChangeTeam}></div>
              <div className="WPG" onClick={this.handleChangeTeam}></div>
            </div>
          </div>
        </div>
      );
    }
  });

module.exports = TeamGrid;
