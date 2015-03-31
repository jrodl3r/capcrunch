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
              <tbody>
                <tr className="header">
                  <td className="player"></td>
                  <td className="cap">Cap Hit</td>
                  <td className="year">14/15</td>
                  <td className="year">15/16</td>
                  <td className="year">16/17</td>
                  <td className="year">17/18</td>
                  <td className="year">18/19</td>
                  <td className="year">19/20</td>
                  <td className="year">20/21</td>
                  <td className="year">21/22</td>
                  <td className="year">22/23</td>
                </tr>
                <tr className="title">
                  <td>Forwards</td>
                  <td className="cap">{this.props.teamData.cap.forwards}</td>
                  <td colSpan="9"></td>
                </tr>
                {playerData.forwards.map(function(forward) {
                  return (
                    <tr className="player forward">
                      <td>{forward.lastname}, {forward.firstname}</td>
                      {forward.contract.map(function(salary, i) {
                        return i === 0 ? <td className="cap">{salary}</td> : <td>{salary}</td>;
                      })}
                    </tr>
                  );
                })}
                <tr className="title">
                  <td>Defensemen</td>
                  <td className="cap">{this.props.teamData.cap.defensemen}</td>
                  <td colSpan="9"></td>
                </tr>
                {playerData.defensemen.map(function(defender) {
                  return (
                    <tr className="player defender">
                      <td>{defender.lastname}, {defender.firstname}</td>
                      {defender.contract.map(function(salary, i) {
                        return i === 0 ? <td className="cap">{salary}</td> : <td>{salary}</td>;
                      })}
                    </tr>
                  );
                })}
                <tr className="title">
                  <td>Goalies</td>
                  <td className="cap">{this.props.teamData.cap.goaltenders}</td>
                  <td colSpan="9"></td>
                </tr>
                {playerData.goaltenders.map(function(goaltender) {
                  return (
                    <tr className="player goaltender">
                      <td>{goaltender.lastname}, {goaltender.firstname}</td>
                      {goaltender.contract.map(function(salary, i) {
                        return i === 0 ? <td className="cap">{salary}</td> : <td>{salary}</td>;
                      })}
                    </tr>
                  );
                })}
                <tr className="title">
                  <td>Other</td>
                  <td className="cap">{this.props.teamData.cap.other}</td>
                  <td colSpan="9"></td>
                </tr>
                {playerData.other.map(function(player) {
                  if (player.firstname) {
                    return (
                      <tr className="player other">
                        <td>{player.lastname}, {player.firstname}</td>
                        {player.contract.map(function(salary, i) {
                          return i === 0 ? <td className="cap">{salary}</td> : <td>{salary}</td>;
                        })}
                      </tr>
                    );
                  } else {
                    return (
                      <tr className="player other">
                        <td>{player.lastname}</td>
                        {player.contract.map(function(salary, i) {
                          return i === 0 ? <td className="cap">{salary}</td> : <td>{salary}</td>;
                        })}
                      </tr>
                    );
                  }
                })}
                <tr className="title">
                  <td>Inactive</td>
                  <td className="cap">{this.props.teamData.cap.inactive}</td>
                  <td colSpan="9"></td>
                </tr>
                {playerData.inactive.map(function(player) {
                  return (
                    <tr className="player inactive">
                      <td>{player.lastname}, {player.firstname}</td>
                      {player.contract.map(function(salary, i) {
                        return i === 0 ? <td className="cap">{salary}</td> : <td>{salary}</td>;
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
