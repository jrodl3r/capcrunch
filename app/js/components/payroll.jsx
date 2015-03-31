// CapCrunch Payroll (Component)
// ==================================================
'use strict';

var UI = require('../ui.js');

var Payroll = React.createClass({
    componentDidUpdate: function() {
      UI.updatePayrollHeight();
    },
    render: function() {
      var playerData = this.props.teamData.players;
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
                {playerData.forwards.map(function(forward) {
                  return (
                    <tr className={ forward.status ? 'player forward ' + forward.status : 'player forward' }>
                      <td><span className="jersey">{forward.jersey}</span>{forward.lastname}, {forward.firstname}</td>
                      {forward.contract.map(function(salary, i) {
                        if (i === 0) { return <td className="cap">{salary}</td>; }
                        else { return <td className={ /[UFA|RFA]/.test(salary) ? salary : '' }><span>{salary}</span></td>; }
                      })}
                    </tr>
                  );
                })}
                <tr className="title">
                  <td><i className="fa fa-angle-double-down"></i>Defensemen</td>
                  <td className="cap">{this.props.teamData.cap.defensemen}</td>
                  <td colSpan="9"></td>
                </tr>
                {playerData.defensemen.map(function(defender) {
                  return (
                    <tr className={ defender.status ? 'player defender ' + defender.status : 'player defender' }>
                      <td><span className="jersey">{defender.jersey}</span>{defender.lastname}, {defender.firstname}</td>
                      {defender.contract.map(function(salary, i) {
                        if (i === 0) { return <td className="cap">{salary}</td>; }
                        else { return <td className={ /[UFA|RFA]/.test(salary) ? salary : '' }><span>{salary}</span></td>; }
                      })}
                    </tr>
                  );
                })}
                <tr className="title">
                  <td><i className="fa fa-angle-double-down"></i>Goalies</td>
                  <td className="cap">{this.props.teamData.cap.goaltenders}</td>
                  <td colSpan="9"></td>
                </tr>
                {playerData.goaltenders.map(function(goaltender) {
                  return (
                    <tr className={ goaltender.status ? 'player goaltender ' + goaltender.status : 'player goaltender' }>
                      <td><span className="jersey">{goaltender.jersey}</span>{goaltender.lastname}, {goaltender.firstname}</td>
                      {goaltender.contract.map(function(salary, i) {
                        if (i === 0) { return <td className="cap">{salary}</td>; }
                        else { return <td className={ /[UFA|RFA]/.test(salary) ? salary : '' }><span>{salary}</span></td>; }
                      })}
                    </tr>
                  );
                })}
                <tr className="title">
                  <td><i className="fa fa-angle-double-down"></i>Other</td>
                  <td className="cap">{this.props.teamData.cap.other}</td>
                  <td colSpan="9"></td>
                </tr>
                {playerData.other.map(function(player) {
                  if (player.firstname) {
                    return (
                      <tr className={ player.status ? 'player other ' + player.status : 'player other' }>
                        <td><span className="jersey">{player.jersey}</span>{player.lastname}, {player.firstname}</td>
                        {player.contract.map(function(salary, i) {
                          if (i === 0) { return <td className="cap">{salary}</td>; }
                          else { return <td className={ /[UFA|RFA]/.test(salary) ? salary : '' }><span>{salary}</span></td>; }
                        })}
                      </tr>
                    );
                  } else {
                    return (
                      <tr className="player other overage">
                        <td><span className="jersey">&nbsp;</span>{player.lastname}</td>
                        {player.contract.map(function(salary, i) {
                          if (i === 0) { return <td className="cap">{salary}</td>; }
                          else { return <td className={ /[UFA|RFA]/.test(salary) ? salary : '' }><span>{salary}</span></td>; }
                        })}
                      </tr>
                    );
                  }
                })}
                <tr className="title">
                  <td><i className="fa fa-angle-double-down"></i>Inactive</td>
                  <td className="cap">{this.props.teamData.cap.inactive}</td>
                  <td colSpan="9"></td>
                </tr>
                {playerData.inactive.map(function(player) {
                  return (
                    <tr className={ player.status ? 'player other ' + player.status : 'player inactive' }>
                      <td><span className="jersey">{player.jersey}</span>{player.lastname}, {player.firstname}</td>
                      {player.contract.map(function(salary, i) {
                        if (i === 0) { return <td className="cap">{salary}</td>; }
                        else { return <td className={ /[UFA|RFA]/.test(salary) ? salary : '' }><span>{salary}</span></td>; }
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  });

module.exports = Payroll;
