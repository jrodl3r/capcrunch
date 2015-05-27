'use strict';

var CapStats = require('./capstats.jsx');

var Payroll = React.createClass({

  shouldComponentUpdate: function(nextProps) {
    return this.props.activeView !== nextProps.activeView;
  },

  buildPlayerGroup: function(players, type) {
    var list, status, row;
    list = players.map(function(player, i) {
      if (!/(acquired|created)/.test(player.action)) {
        status = player.status;
        row = !/(inplay|ir|benched)/.test(status) ? type + ' ' + status : type;
        if (player.firstname) {
          return (
            <tr key={i + player.id} className={ i % 2 === 0 ? 'odd ' + row : row }>
              <td className="first">
                <span className="jersey">{player.jersey}</span>
                {player.lastname}, {player.firstname}
                { status === 'injured' ? <i className="fa fa-medkit" title="Injured Reserve"></i> : null }
                { status === 'buyout' ? <i className="fa fa-money" title="Buyout"></i> : null }
                { status === 'outside' ? <i className="fa fa-info-circle" title="Outside League"></i> : null }
                { /(traded|waived|retired)/.test(status)
                  ? <i className="fa fa-info-circle" title={ status.charAt(0).toUpperCase() + status.slice(1) }></i> : null }
              </td>
              {player.contract.map(function(salary, j) {
                if (j === 0) { return <td key={j} className="cap">{salary}</td>; }
                else { return <td key={j} className={ /[UFA|RFA]/.test(salary) ? salary : '' }><span>{salary}</span></td>; }
              })}
            </tr>
          );
        } else {
          return (
            <tr key={i + player.id} className={ i % 2 === 0 ? 'odd overage' : 'overage' }>
              <td className="first"><span className="jersey">&nbsp;</span>{player.lastname}</td>
              {player.contract.map(function(salary, j) {
                if (j === 0) { return <td key={j} className="cap">{salary}</td>; }
                else { return <td key={j}><span>{salary}</span></td>; }
              })}
            </tr>
          );
        }
      }
    });
    return list;
  },

  render: function() {

    return (
      <div id="payroll" className={ this.props.activeView === 'payroll' ? 'section active' : 'section' }>
        <h2>{this.props.teamData.name}
          <CapStats
            activeView="payroll"
            playerCount={this.props.teamData.players.forwards.length + this.props.teamData.players.defensemen.length + this.props.teamData.players.goaltenders.length}
            capData={this.props.teamData.cap} />
        </h2>
        <div className="inner">
          <table id="payroll-table">
            <thead>
              <tr className="header">
                <th className="first"></th>
                <th className="cap">Cap Hit</th>
                <th className="year">14/15</th>
                <th className="year">15/16</th>
                <th className="year">16/17</th>
                <th className="year">17/18</th>
                <th className="year">18/19</th>
                <th className="year">19/20</th>
                <th className="year">20/21</th>
                <th className="year">21/22</th>
                <th className="year">22/23</th>
              </tr>
            </thead>
            <tbody>
              <tr className="title">
                <td className="first"><i className="fa fa-angle-double-down"></i>Forwards</td>
                <td className="cap">{this.props.teamData.cap.forwards}</td>
                <td colSpan="9"></td>
              </tr>
              {this.buildPlayerGroup(this.props.teamData.players.forwards, 'forward')}
              <tr className="title">
                <td className="first"><i className="fa fa-angle-double-down"></i>Defensemen</td>
                <td className="cap">{this.props.teamData.cap.defensemen}</td>
                <td colSpan="9"></td>
              </tr>
              {this.buildPlayerGroup(this.props.teamData.players.defensemen, 'defender')}
              <tr className="title">
                <td className="first"><i className="fa fa-angle-double-down"></i>Goalies</td>
                <td className="cap">{this.props.teamData.cap.goaltenders}</td>
                <td colSpan="9"></td>
              </tr>
              {this.buildPlayerGroup(this.props.teamData.players.goaltenders, 'goaltender')}
              <tr className="title">
                <td className="first"><i className="fa fa-angle-double-down"></i>Other</td>
                <td className="cap">{this.props.teamData.cap.other}</td>
                <td colSpan="9"></td>
              </tr>
              {this.buildPlayerGroup(this.props.teamData.players.other, 'other')}
              <tr className="title">
                <td className="first"><i className="fa fa-angle-double-down"></i>Inactive</td>
                <td className="cap">{this.props.teamData.cap.inactive}</td>
                <td colSpan="9"></td>
              </tr>
              {this.buildPlayerGroup(this.props.teamData.players.inactive, 'other')}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});

module.exports = Payroll;
