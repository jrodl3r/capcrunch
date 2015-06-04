'use strict';

var PayrollTable = React.createClass({

  shouldComponentUpdate: function(nextProps) {
    return nextProps.activeView === 'payroll';
  },

  playerGroup: function(players) {
    var row, group, year = this.props.year, x = 0;
    group = players.map(function(player, i) {
      if (!/(acquired|created)/.test(player.action)) {
        row = x % 2 ? '' : 'even';
        x = x + 1;
        return (
          <tr className={row}>
            <td className="first">
              <span className="marker jersey">{player.jersey}</span>
              <span className="name">{player.lastname}, {player.firstname}</span>
              { player.status === 'injured' ? <i className="status fa fa-medkit" title="Injured Reserve"></i> : null }
              { player.status === 'buyout' ? <i className="status fa fa-money" title="Buyout"></i> : null }
              { player.status === 'outside' ? <i className="status fa fa-info-circle" title="Outside League"></i> : null }
              { /(traded|waived|retired)/.test(player.status)
                ? <i className="status fa fa-info-circle" title={ player.status.charAt(0).toUpperCase() + player.status.slice(1) }></i> : null }
            </td>
            { player.capnum === '0.000' ? <td className="num zero">-</td> : <td className="num">{player.capnum}</td> }
            { player.caphit === '0.000' ? <td className="hit zero">-</td> : <td className="hit">{player.caphit}</td> }
            { player.contract.map(function(salary, j) {
              if (salary) { return <td className={ j === year ? 'cur' : '' }><span className={ /(UFA|RFA)/.test(salary) ? salary : '' }>{salary}</span></td>; }
              else { return <td></td>; }
            }) }
          </tr>
        );
      }
    });
    return group;
  },

  render: function() {

    return (
      <table id="payroll-table">
        <thead>
          <tr className="header">
            <th className="first"></th><th className="num">Cap Num</th><th className="hit">Cap Hit</th><th className="year">09/10</th>
            <th className="year">10/11</th><th className="year">11/12</th><th className="year">12/13</th><th className="year">13/14</th>
            <th className="year">14/15</th><th className="year cur">15/16</th><th className="year">16/17</th><th className="year">17/18</th>
            <th className="year">18/19</th><th className="year">19/20</th><th className="year">20/21</th><th className="year">21/22</th>
            <th className="year">22/23</th><th className="year last">23/24</th>
          </tr>
        </thead>
        <tbody>
          <tr className="title forwards">
            <td className="first"><span className="title-icon"><i className="marker fa fa-angle-double-down"></i></span>Forwards</td>
            <td className="num"></td><td className="hit">{this.props.teamData.cap.forwards}</td>
            <td className="year">09/10</td><td className="year">10/11</td><td className="year">11/12</td><td className="year">12/13</td>
            <td className="year">13/14</td><td className="year">14/15</td><td className="year cur">15/16</td><td className="year">16/17</td>
            <td className="year">17/18</td><td className="year">18/19</td><td className="year">19/20</td><td className="year">20/21</td>
            <td className="year">21/22</td><td className="year">22/23</td><td className="year last">23/24</td>
          </tr>
          {this.playerGroup(this.props.teamData.players.forwards)}
          <tr className="title defensemen">
            <td className="first"><span className="title-icon"><i className="marker fa fa-angle-double-down"></i></span>Defensemen</td>
            <td className="num"></td><td className="hit">{this.props.teamData.cap.defensemen}</td>
            <td className="year">09/10</td><td className="year">10/11</td><td className="year">11/12</td><td className="year">12/13</td>
            <td className="year">13/14</td><td className="year">14/15</td><td className="year cur">15/16</td><td className="year">16/17</td>
            <td className="year">17/18</td><td className="year">18/19</td><td className="year">19/20</td><td className="year">20/21</td>
            <td className="year">21/22</td><td className="year">22/23</td><td className="year last">23/24</td>
          </tr>
          {this.playerGroup(this.props.teamData.players.defensemen)}
          <tr className="title goaltenders">
            <td className="first"><span className="title-icon"><i className="marker fa fa-angle-double-down"></i></span>Goalies</td>
            <td className="num"></td><td className="hit">{this.props.teamData.cap.goaltenders}</td>
            <td className="year">09/10</td><td className="year">10/11</td><td className="year">11/12</td><td className="year">12/13</td>
            <td className="year">13/14</td><td className="year">14/15</td><td className="year cur">15/16</td><td className="year">16/17</td>
            <td className="year">17/18</td><td className="year">18/19</td><td className="year">19/20</td><td className="year">20/21</td>
            <td className="year">21/22</td><td className="year">22/23</td><td className="year last">23/24</td>
          </tr>
          {this.playerGroup(this.props.teamData.players.goaltenders)}
      { this.props.teamData.players.other.length
        ? <tr className="title other">
            <td className="first"><span className="title-icon"><i className="marker fa fa-angle-double-down"></i></span>Other</td>
            <td className="num"></td><td className="hit">{this.props.teamData.cap.other}</td>
            <td className="year">09/10</td><td className="year">10/11</td><td className="year">11/12</td><td className="year">12/13</td>
            <td className="year">13/14</td><td className="year">14/15</td><td className="year cur">15/16</td><td className="year">16/17</td>
            <td className="year">17/18</td><td className="year">18/19</td><td className="year">19/20</td><td className="year">20/21</td>
            <td className="year">21/22</td><td className="year">22/23</td><td className="year last">23/24</td>
          </tr> : null }
          { this.props.teamData.players.other.length ? this.playerGroup(this.props.teamData.players.other) : null }
          <tr className="title inactive">
            <td className="first"><span className="title-icon"><i className="marker fa fa-angle-double-down"></i></span>Inactive</td>
            <td className="num"></td>
            { this.props.teamData.cap.inactive === '0.000' ? <td className="hit zero">-</td> : <td className="hit">{this.props.teamData.cap.inactive}</td> }
            <td className="year">09/10</td><td className="year">10/11</td><td className="year">11/12</td><td className="year">12/13</td>
            <td className="year">13/14</td><td className="year">14/15</td><td className="year cur">15/16</td><td className="year">16/17</td>
            <td className="year">17/18</td><td className="year">18/19</td><td className="year">19/20</td><td className="year">20/21</td>
            <td className="year">21/22</td><td className="year">22/23</td><td className="year last">23/24</td>
          </tr>
          {this.playerGroup(this.props.teamData.players.inactive)}
        </tbody>
      </table>
    );
  }
});

module.exports = PayrollTable;
