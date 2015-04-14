// CapCrunch Payroll (Component)
// ==================================================
'use strict';

var UI = require('../ui.js');

var Payroll = React.createClass({
    componentDidUpdate: function() {
      UI.updatePayrollHeight();
    },

    buildPlayerGroup: function(players, player_type) {
      var player_list, status_class;
      player_list = players.map(function(player, i) {
        status_class = player.status ? 'player ' + player_type + ' ' + player.status : 'player ' + player_type;
        if (player.actions && player.actions.indexOf('acquired') !== -1) {
          return null;
        } else {
          if (player.firstname) {
            return (
              <tr key={i + player.id} className={status_class}>
                <td>
                  <span className="jersey">{player.jersey}</span>
                  {player.lastname}, {player.firstname}
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
      return player_list;
    },

    render: function() {
      var playerData    = this.props.teamData.players,
          forwardItems  = this.buildPlayerGroup(playerData.forwards, 'forward'),
          defenseItems  = this.buildPlayerGroup(playerData.defensemen, 'defender'),
          goalieItems   = this.buildPlayerGroup(playerData.goaltenders, 'goaltender'),
          otherItems    = this.buildPlayerGroup(playerData.other, 'other'),
          inactiveItems = this.buildPlayerGroup(playerData.inactive, 'other');

      return (
        <div id="payroll" className="section">
          <h2>{this.props.teamData.name}
            <div id="payroll-stats" className="cap-stats active">
              <div id="pcap-player-count" className="section">
                Roster Players <span className="value">
                  {playerData.forwards.length + playerData.defensemen.length + playerData.goaltenders.length}
                </span>
              </div>
              <div id="pcap-payroll-total" className="section">
                Payroll Total <span className="value">{this.props.teamData.cap.hit}</span>
              </div>
              <div id="pcap-cap-space" className="section">
                Cap Space <span className="value">{this.props.teamData.cap.space}</span>
              </div>
              <div id="pcap-salary-cap" className="section">
                Salary Cap <span className="value">{this.props.leagueData.cap}</span>
              </div>
            </div>
          </h2>
          <div className="inner">
            <table id="team-payroll">
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
                {forwardItems}
                <tr className="title">
                  <td><i className="fa fa-angle-double-down"></i>Defensemen</td>
                  <td className="cap">{this.props.teamData.cap.defensemen}</td>
                  <td colSpan="9"></td>
                </tr>
                {defenseItems}
                <tr className="title">
                  <td><i className="fa fa-angle-double-down"></i>Goalies</td>
                  <td className="cap">{this.props.teamData.cap.goaltenders}</td>
                  <td colSpan="9"></td>
                </tr>
                {goalieItems}
                <tr className="title">
                  <td><i className="fa fa-angle-double-down"></i>Other</td>
                  <td className="cap">{this.props.teamData.cap.other}</td>
                  <td colSpan="9"></td>
                </tr>
                {otherItems}
                <tr className="title">
                  <td><i className="fa fa-angle-double-down"></i>Inactive</td>
                  <td className="cap">{this.props.teamData.cap.inactive}</td>
                  <td colSpan="9"></td>
                </tr>
                {inactiveItems}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  });

module.exports = Payroll;
