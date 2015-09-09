'use strict';

var PicksTable = require('./picks-table.jsx');

var PayrollTable = React.createClass({

  playerGroup: function(players) {
    var year = this.props.year, row, cell, group, signed, status, x = 0;
    group = players.map(function(player, i) {
      if (!/(acquired|created)/.test(player.action)) {
        row = x % 2 ? '' : 'even';
        x = x + 1;
        signed = player.prev_contract ? player.prev_contract : false;
        return (
          <tr key={i} className={row}>
            <td className="first">
              <span className="marker jersey">{player.jersey}</span>
              <span className="name">{player.lastname}, {player.firstname}</span>
              { player.status === 'injured' ? <i className="status fa fa-medkit" title="Injured Reserve"></i> : null }
              { player.status === 'buyout' ? <i className="status fa fa-money" title="Buyout"></i> : null }
              { player.status === 'outside' ? <i className="status fa fa-info-circle" title="Outside League"></i> : null }
              { /(traded|waived|retired)/.test(player.status)
                ? <i className="status fa fa-info-circle" title={ player.status.charAt(0).toUpperCase() + player.status.slice(1) }></i> : null }
            </td>
            { player.capnum === '0.000' || signed ? <td className="num zero">-</td> : <td className="num">{player.capnum}</td> }
            { player.caphit === '0.000' || signed ? <td className="hit zero">-</td> : <td className="hit">{player.caphit}</td> }
            { player.contract.map(function(salary, j) {
              cell = j === year ? 'cur' : '';
              cell = j === 14 ? cell + ' last' : cell;
              status = /(UFA|RFA)/.test(salary) ? salary : '';
              status = j === year && signed ? player.prev_contract : status;
              return (
                <td key={j} className={cell}>
                  <span className={status}>
                    { salary && !signed ? salary : null }
                    { signed && j !== year ? '' : null }
                    { signed && j === year ? player.prev_contract : null }
                  </span>
                </td>
              );
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
            <th className="first"></th><th className="num">Cap Num</th><th className="hit">Cap Hit</th>
            <th className="year">2009</th><th className="year">2010</th><th className="year">2011</th><th className="year">2012</th>
            <th className="year">2013</th><th className="year">2014</th><th className="year cur">2015</th><th className="year">2016</th>
            <th className="year">2017</th><th className="year">2018</th><th className="year">2019</th><th className="year">2020</th>
            <th className="year">2021</th><th className="year">2022</th><th className="year last">2023</th>
          </tr>
        </thead>
        <tbody>
          <tr className="title forwards">
            <td className="first"><span className="title-icon"><i className="marker fa fa-angle-double-down"></i></span>Forwards</td>
            <td className="num"></td><td className="hit">{this.props.teamData.cap.forwards}</td>
            <td className="year">2009</td><td className="year">2010</td><td className="year">2011</td><td className="year">2012</td>
            <td className="year">2013</td><td className="year">2014</td><td className="year cur">2015</td><td className="year">2016</td>
            <td className="year">2017</td><td className="year">2018</td><td className="year">2019</td><td className="year">2020</td>
            <td className="year">2021</td><td className="year">2022</td><td className="year last">2023</td>
          </tr>
          {this.playerGroup(this.props.teamData.players.forwards)}
          <tr className="title defensemen">
            <td className="first"><span className="title-icon"><i className="marker fa fa-angle-double-down"></i></span>Defensemen</td>
            <td className="num"></td><td className="hit">{this.props.teamData.cap.defensemen}</td>
            <td className="year">2009</td><td className="year">2010</td><td className="year">2011</td><td className="year">2012</td>
            <td className="year">2013</td><td className="year">2014</td><td className="year cur">2015</td><td className="year">2016</td>
            <td className="year">2017</td><td className="year">2018</td><td className="year">2019</td><td className="year">2020</td>
            <td className="year">2021</td><td className="year">2022</td><td className="year last">2023</td>
          </tr>
          {this.playerGroup(this.props.teamData.players.defensemen)}
          <tr className="title goaltenders">
            <td className="first"><span className="title-icon"><i className="marker fa fa-angle-double-down"></i></span>Goalies</td>
            <td className="num"></td><td className="hit">{this.props.teamData.cap.goaltenders}</td>
            <td className="year">2009</td><td className="year">2010</td><td className="year">2011</td><td className="year">2012</td>
            <td className="year">2013</td><td className="year">2014</td><td className="year cur">2015</td><td className="year">2016</td>
            <td className="year">2017</td><td className="year">2018</td><td className="year">2019</td><td className="year">2020</td>
            <td className="year">2021</td><td className="year">2022</td><td className="year last">2023</td>
          </tr>
          {this.playerGroup(this.props.teamData.players.goaltenders)}
      { this.props.teamData.players.other.length
        ? <tr className="title other">
            <td className="first"><span className="title-icon"><i className="marker fa fa-angle-double-down"></i></span>Other</td>
            <td className="num"></td>
        { this.props.teamData.cap.inactive === '0.000'
          ? <td className="hit zero">-</td>
          : <td className="hit">{this.props.teamData.cap.other}</td> }
            <td className="year">2009</td><td className="year">2010</td><td className="year">2011</td><td className="year">2012</td>
            <td className="year">2013</td><td className="year">2014</td><td className="year cur">2015</td><td className="year">2016</td>
            <td className="year">2017</td><td className="year">2018</td><td className="year">2019</td><td className="year">2020</td>
            <td className="year">2021</td><td className="year">2022</td><td className="year last">2023</td>
          </tr> : null }
          { this.props.teamData.players.other.length ? this.playerGroup(this.props.teamData.players.other) : null }
          <tr className="title inactive">
            <td className="first"><span className="title-icon"><i className="marker fa fa-angle-double-down"></i></span>Inactive</td>
            <td className="num"></td>
        { this.props.teamData.cap.inactive === '0.000'
          ? <td className="hit zero">-</td>
          : <td className="hit">{this.props.teamData.cap.inactive}</td> }
            <td className="year">2009</td><td className="year">2010</td><td className="year">2011</td><td className="year">2012</td>
            <td className="year">2013</td><td className="year">2014</td><td className="year cur">2015</td><td className="year">2016</td>
            <td className="year">2017</td><td className="year">2018</td><td className="year">2019</td><td className="year">2020</td>
            <td className="year">2021</td><td className="year">2022</td><td className="year last">2023</td>
          </tr>
          {this.playerGroup(this.props.teamData.players.inactive)}
        </tbody>
      </table>
    );
  }
// <tr className="title other">
//   <td className="first"><span className="title-icon"><i className="marker fa fa-angle-double-down"></i></span>Draft Picks</td>
//   <td colSpan="17"></td>
// </tr>
// <tr className="picks-row">
//   <PicksTable activeView={this.props.activeView} pickData={this.props.pickData} />
// </tr>

// <th className="year">2009</th><th className="year">2010</th><th className="year">2011</th><th className="year">2012</th>
// <th className="year">2013</th><th className="year">2014</th><th className="year cur">2015</th><th className="year">2016</th>
// <th className="year">2017</th><th className="year">2018</th><th className="year">2019</th><th className="year">2020</th>
// <th className="year">2021</th><th className="year">2022</th><th className="year last">2023</th>
});

module.exports = PayrollTable;
