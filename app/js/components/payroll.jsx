'use strict';

var CapStats = require('./capstats.jsx'),
    PayrollTable = require('./payroll-table.jsx');

var Payroll = React.createClass({

  shouldComponentUpdate: function(nextProps) {
    return this.props.activeView !== nextProps.activeView;
  },

  render: function() {
    // TODO: Should be capStats.playerCount + teamData.cap.playerCount
    var playerCount = this.props.teamData.players.forwards.length + this.props.teamData.players.defensemen.length + this.props.teamData.players.goaltenders.length;

    return (
      <div id="payroll" className={ this.props.activeView === 'payroll' ? 'section active' : 'section' }>
        <h2>{this.props.teamData.name}
          <CapStats activeView="payroll" playerCount={playerCount} capData={this.props.teamData.cap} />
        </h2>
        <div className="inner">
          <PayrollTable activeView={this.props.activeView} teamData={this.props.teamData} />
        </div>
      </div>
    );
  }
});

module.exports = Payroll;
