'use strict';

var CapStats = require('./capstats.jsx');

var Payroll = React.createClass({

  shouldComponentUpdate: function(nextProps) {
    return this.props.activeView !== nextProps.activeView;
  },
  buildPlayerGroup: function(players, type) {
    var list = players.map(function(player, i) {
      if (player.status === 'acquired') {
        return null;
      } else {
        var status = player.status ? 'player ' + type + ' ' + player.status : 'player ' + type;
        if (player.firstname) {
          return (
            <tr key={i + player.id} className={status}>
              <td>
                <span className="jersey">{player.jersey}</span>
                { player.lastname + ', ' } {player.firstname}
                { player.status === 'injured' ? <i className="fa fa-heartbeat" title="Injured Reserve"></i> : null }
                { player.status === 'traded' ? <i className="fa fa-suitcase" title="Traded"></i> : null }
                { player.status === 'waived' ? <i className="fa fa-thumbs-o-down" title="Waived"></i> : null }
                { player.status === 'retired' ? <i className="fa fa-angellist" title="Retired"></i> : null }
                { player.status === 'buyout' ? <i className="fa fa-money" title="Buyout"></i> : null }
                { player.status === 'outside' ? <i className="fa fa-plane" title="Outside League"></i> : null }
              </td>
              {player.contract.map(function(salary, j) {
                if (j === 0) { return <td key={j} className="cap">{salary}</td>; }
                else { return <td key={j} className={ /[UFA|RFA]/.test(salary) ? salary : '' }><span>{salary}</span></td>; }
              })}
            </tr>
          );
        } else {
          return (
            <tr key={i + player.id} className="player other overage">
              <td><span className="jersey">&nbsp;</span>{player.lastname}</td>
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
                <th className="player"></th>
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
                <td><i className="fa fa-angle-double-down"></i>Forwards</td>
                <td className="cap">{this.props.teamData.cap.forwards}</td>
                <td colSpan="9"></td>
              </tr>
              {this.buildPlayerGroup(this.props.teamData.players.forwards, 'forward')}
              <tr className="title">
                <td><i className="fa fa-angle-double-down"></i>Defensemen</td>
                <td className="cap">{this.props.teamData.cap.defensemen}</td>
                <td colSpan="9"></td>
              </tr>
              {this.buildPlayerGroup(this.props.teamData.players.defensemen, 'defender')}
              <tr className="title">
                <td><i className="fa fa-angle-double-down"></i>Goalies</td>
                <td className="cap">{this.props.teamData.cap.goaltenders}</td>
                <td colSpan="9"></td>
              </tr>
              {this.buildPlayerGroup(this.props.teamData.players.goaltenders, 'goaltender')}
              <tr className="title">
                <td><i className="fa fa-angle-double-down"></i>Other</td>
                <td className="cap">{this.props.teamData.cap.other}</td>
                <td colSpan="9"></td>
              </tr>
              {this.buildPlayerGroup(this.props.teamData.players.other, 'other')}
              <tr className="title">
                <td><i className="fa fa-angle-double-down"></i>Inactive</td>
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
