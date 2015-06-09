'use strict';

var UI = require('../../ui.js');

var GMPanel = React.createClass({

  componentDidUpdate: function () {
    var haveItems = this.props.created.length + this.props.unsigned.length + this.props.trades.length, height = 34, x;
    if (this.props.trades.length) {
      height = height + 28;
      for (x = 0; x < this.props.trades.length; x++) {
        height = height + 28;
        if (this.props.trades[x].user.length > this.props.trades[x].league.length) { height = height + (this.props.trades[x].user.length * 20); }
        else { height = height + (this.props.trades[x].league.length * 20); }
      }
    }
    if (haveItems > 1) {
      if (this.props.unsigned.length) { height = height + 28 + (this.props.unsigned.length * 33); }
      if (this.props.created.length) { height = height + 28 + (this.props.created.length * 33); }
      $('#overview').css('height', height);
    } else if (haveItems === 1) {
      if (this.props.trades.length) {
        $('#overview').css('height', height);
      } else { $('#overview').css('height', 95); }
    } else { $('#overview').css('height', 0); }
    $('.confirm-slider.active').removeClass('active');
  },

  listUnsigned: function() {
    return (
      <div className="unsigned">
        <div className="heading">Unsigned</div>
        <ul className="list">
          { this.props.unsigned.map(function(player, i) {
            return (
              <li key={ i + player.id } className="item">
                <span className="status">{player.contract[6]}</span>
                <span className="name">{player.lastname}, {player.firstname}</span>
                <a className="button">Sign</a>
              </li>
            );
          }) }
        </ul>
      </div>
    );
  },

  listSigned: function() {
    return (
      <div className="signed">
        <div className="heading">Unsigned</div>
        <ul className="list">
          { this.props.signed.map(function(player, i) {
            return (
              <li key={ i + player.id } className="item">
                <span className="name">{player.lastname}, {player.firstname}</span>
                <a className="button">Undo</a>
                <span className="salary">{player.contract[6]}</span>
              </li>
            );
          }) }
        </ul>
      </div>
    );
  },

  listCreated: function() {
    return (
      <div className="created">
        <div className="heading">Created</div>
        <ul className="list">
          { this.props.created.map(function(player, i) {
            return (
              <li key={ i + player.id } className="item">
                <span className="status">{player.position}</span>
                <span className="name">{player.lastname}, {player.firstname}</span>
                <a className="button" data-target={player.id} onClick={this.showUndoConfirm}>Undo</a>
                <span className="salary">{player.contract[6]}</span>
                <div id={ player.id + '-undo-confirm' } className="confirm-slider">
                  Are you sure?
                  <div className="confirm-buttons">
                    <a data-id={player.id} onClick={this.props.undoCreatePlayer}>Yes</a><span> / </span>
                    <a className={ player.id + '-undo-confirm' } onClick={this.hideUndoConfirm}>No</a>
                  </div>
                </div>
              </li>
            );
          }.bind(this)) }
        </ul>
      </div>
    );
  },

  listTrades: function() {
    return (
      <div className="trades">
        <div className="heading">Trades</div>
        <ul className="list">
          { this.props.trades.map(function(trade, i) {
            return (
              <li key={i} className="trade item">
                <ul className="user">
                  <li className="team">{trade.user[0].team}</li>
                  { trade.user.map(function(player, j) {
                    return <li key={ j + player.id }>{player.firstname.charAt(0)}. {player.lastname}</li>;
                  }) }
                </ul>
                <ul className="league">
                  <li className="team">{trade.league[0].team_orig}</li>
                  { trade.league.map(function(player, k) {
                    return <li key={ k + player.id }>{player.firstname.charAt(0)}. {player.lastname}</li>;
                  }) }
                </ul>
                <a className="button">Undo</a>
              </li>
            );
          }) }
        </ul>
      </div>
    );
  },

  showUndoConfirm: function (e) {
    e.preventDefault();
    document.getElementById(e.target.getAttribute('data-target') + '-undo-confirm').className = 'confirm-slider active';
  },

  hideUndoConfirm: function (e) {
    e.preventDefault();
    document.getElementById(e.target.className).className = 'confirm-slider';
  },

  render: function() {
    var active = this.props.trades.length + this.props.created.length + this.props.unsigned.length,
        loaded = active > 1 ? 'loaded ' : '';

    return (
      <div id="overview" className={ active ? loaded + 'active panel' : 'panel' }>
        <div className="title">GM Overview
          <a onClick={UI.togglePanelView}><i className="fa fa-chevron-up"></i></a>
        </div>
        <div className="inner">
          { this.props.unsigned.length ? this.listUnsigned() : null }
          { this.props.signed.length ? this.listSigned() : null }
          { this.props.created.length ? this.listCreated() : null }
          { this.props.trades.length ? this.listTrades() : null }
        </div>
        <div className={ this.props.dragType ? 'waiting active' : 'waiting' }></div>
      </div>
    );
  }
});

module.exports = GMPanel;
