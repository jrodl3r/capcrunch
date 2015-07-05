'use strict';

var years = ['2015','2016','2017','2018'],
    rounds = ['1','2','3','4','5','6','7'];

var PicksTable = React.createClass({

  buildPicks: function(year, round, label) {
    var pos, key = 'Y' + year, info = '',
        last = year === '18' && round === 7 ? 'last ' : '';
    return (
      <td className={ year % 2 ? last : last + 'odd' }>
        { this.props.pickData[key].map(function(pick, i) {
          if (parseInt(pick.round) === round) {
            if (pick.status === 'acquired' || pick.status === 'acquired-cond') {
              info = '<p><span class="pick-title">Acquired from ' + pick.from.id + ': </span>' + pick.from.info;
              if (pick.from.orig) { info = info + '&nbsp; <span class="pick-title">(Originally acquired from ' + pick.from.orig + ')</span></p>'; }
              else { info = info + '</p>'; }
            } else if (pick.status === 'traded' || pick.status === 'traded-cond') {
              info = '<p><span class="pick-title">Traded to ' + pick.to.id + ': </span>' + pick.to.info + '</p>';
            } else if (pick.status === 'acquired-traded') {
              info = '<p><span class="pick-title">Acquired from ' + pick.from.id + ': </span>' + pick.from.info + '</p><p><span class="pick-title">Traded to ' + pick.to.id + ': </span>' + pick.to.info + '</p>';
            } else if (pick.status === 'traded-acquired') {
              info = '<p><span class="pick-title">Traded to ' + pick.to.id + ': </span>' + pick.to.info + ': </p><p><span class="pick-title">Acquired from ' + pick.from.id + ': </span>' + pick.from.info + '</p>';
            }
            pos = '';
            if (round > 5) {
              pos = 'bottom ';
              if (info.length > 230 && info.length < 379) { pos = pos + 'tall '; }
              else if (info.length >= 380 && info.length < 420) { pos = pos + 'tall-mid '; }
              else if (info.length >= 420 && info.length < 500) { pos = pos + 'taller '; }
              else if (info.length >= 500 && info.length < 600) { pos = pos + 'large '; }
              else if (info.length >= 600) { pos = pos + 'larger '; }
            }
            if (parseInt(year) === 16) { pos = pos + 'shift '; }
            else if (parseInt(year) > 16) { pos = pos + 'full-shift '; }
            return (
              <span key={i} className={ pick.status + ' pick' }>
                { pick.status === 'own' ? <span className="own label">Own {label}</span> : null }
                { pick.status === 'acquired' || pick.status === 'acquired-cond' || pick.status === 'traded-acquired'
                  ? <span className="label">From {pick.from.id}</span> : null }
                { pick.status === 'traded' || pick.status === 'traded-cond' || pick.status === 'acquired-traded'
                  ? <span className="label">To {pick.to.id}</span> : null }
                { pick.status === 'acquired' ? <div className="tag acquired">A</div> : null }
                { pick.status === 'acquired-cond' ? <div className="tag acquired">AC</div> : null }
                { pick.status === 'traded' ? <div className="tag traded">T</div> : null }
                { pick.status === 'traded-cond' ? <div className="tag traded">TC</div> : null }
                { pick.status === 'acquired-traded' ? <div className="tag traded">AT</div> : null }
                { pick.status === 'traded-acquired' ? <div className="tag acquired">TA</div> : null }
                { pick.status !== 'own' ? <div className={ pos + 'info' } dangerouslySetInnerHTML={{ __html: info }} /> : null }
              </span>
            );
          }
        }) }
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
            {this.buildRow(1, '1st')}
            {this.buildRow(2, '2nd')}
            {this.buildRow(3, '3rd')}
            {this.buildRow(4, '4th')}
            {this.buildRow(5, '5th')}
            {this.buildRow(6, '6th')}
            {this.buildRow(7, '7th')}
          </tbody>
        </table>
      </td>
    );
  }
});

module.exports = PicksTable;
