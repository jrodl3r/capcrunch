'use strict';

var years = ['2015','2016','2017','2018'],
    rounds = ['1','2','3','4','5','6','7'];

var PicksTable = React.createClass({

  buildPicks: function(year, round, label) {
    var info, key = 'Y' + year,
        last = year === '18' && round === 7 ? 'last ' : '';
    return (
      <td className={ year % 2 ? last : last + 'odd' }>
        { this.props.pickData[key].map(function(pick) {
          if (parseInt(pick.round) === round) {
            if (pick.status === 'acquired') {
              info = pick.from.info;
            } else if (pick.status === 'acquired-traded') {
              info = pick.from.info + '...' + pick.to.info;
            } else if (/(traded|traded-cond)/.test(pick.status)) {
              info = pick.to.info;
            }
            //{this.props.pickData.id}
            return (
              <span className={ pick.status + ' pick' } data-info={info}>

                { pick.status === 'own' ? <span>Own {label}</span> : null }
                { pick.status === 'acquired' ? <span>From {pick.from.id}</span> : null }
                { /(traded|traded-cond|acquired-traded)/.test(pick.status) ? <span>To {pick.to.id}</span> : null }

                { pick.status === 'acquired' ? <div className="tag acquired">A</div> : null }
                { pick.status === 'traded' ? <div className="tag traded">T</div> : null }
                { pick.status === 'traded-cond' ? <div className="tag traded">TC</div> : null }
                { pick.status === 'acquired-traded' ? <div className="tag traded">AT</div> : null }

              </span>
            );
          }
        }.bind(this)) }
      </td>
    );
  },

  buildRow: function(round, label) {
    var last = round === 7 ? 'last ' : '';
    return (
      <tr className={ round % 2 ? last + 'even' : '' }>
        <td className="first">{label} Round</td>
        {this.buildPicks('15', round, label)}
        {this.buildPicks('16', round, label)}
        {this.buildPicks('17', round, label)}
        {this.buildPicks('18', round, label)}
      </tr>
    );
  },

  render: function() {
    return (
      <td colSpan="18">
        <table id="picks-table">
          <thead>
            <tr className="header">
              <th className="first"></th>
              <th>2015</th>
              <th className="odd">2016</th>
              <th>2017</th>
              <th className="last odd">2018</th>
            </tr>
          </thead>
          <tbody>
            {this.buildRow(1, '1st')}{this.buildRow(2, '2nd')}
            {this.buildRow(3, '3rd')}{this.buildRow(4, '4th')}
            {this.buildRow(5, '5th')}{this.buildRow(6, '6th')}
            {this.buildRow(7, '7th')}
          </tbody>
        </table>
      </td>
    );
  }
});

module.exports = PicksTable;
