'use strict';

var CapStats = require('./capstats.jsx'),
    PayrollTable = require('./payroll-table.jsx');

var Payroll = React.createClass({

  render: function() {

    return (
      <div id="payroll" className={ this.props.activeView === 'payroll' ? 'section active' : 'section' }>
        <h2>{this.props.teamData.name}
          <CapStats activeView="payroll" capData={this.props.teamData.cap} league={this.props.capData.cap} />
        </h2>
        <div className="inner">
          <PayrollTable
            activeView={this.props.activeView}
            teamData={this.props.teamData}
            pickData={this.props.pickData}
            year={this.props.capData.year} />
        </div>
      </div>
    );
  }
});

module.exports = Payroll;
