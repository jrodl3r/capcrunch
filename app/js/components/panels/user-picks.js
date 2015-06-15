'use strict';

var UI = require('../../ui.js');

var UserPicks = React.createClass({

  showUserPicks: function() {
    $('#user-picks-list').attr('class', 'active');
    $('#user-picks-list').scrollTo(0);
  },

  hideUserPicks: function() {
    $('#user-picks-list').attr('class', '');
  },

  addUserPick: function(e) {
    this.props.addUserAsset(e);
    this.hideUserPicks();
  },

  buildUserPicksList: function(year) {
    var picks, round, id, label = '', y , z;
    picks = this.props.pickData[ 'Y' + year ].map(function(pick, i) {
      id = this.props.userTeam + year + 'u' + i;
      round = pick.round;
      if (round === '1') { label = '1st'; }
      else if (round === '2') { label = '2nd'; }
      else if (round === '3') { label = '3rd'; }
      else if (round > 3) { label = round + 'th'; }
      for (y = 0; y < this.props.tradeData.length; y++) {
        for (z = 0; z < this.props.tradeData[y].picks.user.length; z++) {
          if (this.props.tradeData[y].picks.user[z].id === id) {
            return (
              <li key={i} className="disabled inplay">
                {label} Round { pick.status !== 'own' ? <span> (from {pick.from.id})</span> : null }
                <i className="fa fa-check"></i>
              </li>
            );
          }}}
      if (this.props.queuedPicks.map(function(p){ return p.id; }).indexOf(id) !== -1) {
        return (
          <li key={i} className="disabled inplay">
            {label} Round { pick.status !== 'own' ? <span> (from {pick.from.id})</span> : null }
            <i className="fa fa-plus"></i>
          </li>
        );
      } else if (pick.status === 'own' || pick.status === 'acquired' || pick.status === 'acquired-cond') {
        return (
          <li key={i} data-type="user-pick" data-year={year} data-index={i} data-label={label} value={id} onClick={this.addUserPick}>
            {label} Round { pick.status !== 'own' ? <span> (from {pick.from.id})</span> : null }
            <i className="fa fa-plus"></i>
          </li>
        );
      } else if (pick.status === 'traded-acquired') {
        return (
          <li key={i} data-type="user-pick" data-year={year} data-index={i} data-label={label} value={id} onClick={this.addUserPick}>
            {label} Round (returned by {pick.from.id})
            <i className="fa fa-plus"></i>
          </li>
        );
      } else if (pick.status === 'acquired-traded') {
        return <li key={i} className="disabled">{label} Round <span> (from {pick.from.id} / to {pick.to.id})</span></li>;
      } else {
        return <li key={i} className="disabled">{label} Round <span> (to {pick.to.id})</span></li>;
      }
    }.bind(this));
    return picks;
  },

  render: function() {

    return (
      <div id="user-picks">
        <a className="user-picks-button" onMouseOver={this.showUserPicks}>
          <i className="fa fa-server" onMouseEnter={this.showUserPicks}></i>
        </a>
        <ul id="user-picks-list" onMouseLeave={this.hideUserPicks}>
          <li className="picks-title">─ 2015 Draft ──────</li>
          {this.buildUserPicksList('15')}
          <li className="picks-title">─ 2016 Draft ──────</li>
          {this.buildUserPicksList('16')}
          <li className="picks-title">─ 2017 Draft ──────</li>
          {this.buildUserPicksList('17')}
          <li className="picks-title">─ 2018 Draft ──────</li>
          {this.buildUserPicksList('18')}
        </ul>
      </div>
    );
  }
});

module.exports = UserPicks;
