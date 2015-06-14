'use strict';

var UI = require('../../ui.js');

var GMPanel = React.createClass({

  componentDidUpdate: function () {
    var haveItems = this.props.created.length + this.props.signed.length + this.props.unsigned.length + this.props.trades.length, height = 34, x;
    if (this.props.trades.length) {
      height = height + 28;
      for (x = 0; x < this.props.trades.length; x++) {
        height = height + 28 + (Math.max(this.props.trades[x].user.length + this.props.trades[x].picks.user.length, this.props.trades[x].league.length + this.props.trades[x].picks.league.length) * 20);
      }}
    if (haveItems > 1) {
      if (this.props.signed.length) { height = height + 28 + (this.props.signed.length * 33); }
      if (this.props.unsigned.length) { height = height + 28 + (this.props.unsigned.length * 33); }
      if (this.props.created.length) { height = height + 28 + (this.props.created.length * 33); }
      $('#overview').css('height', height);
    } else if (haveItems === 1) {
      if (this.props.trades.length) {
        $('#overview').css('height', height);
      } else { $('#overview').css('height', 95); }
    } else { $('#overview').css('height', 0); }
    $('.confirm-slider.active').not('.enagaged').removeClass('active');
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
                <a className="button" data-target={ 'sign-confirm-' + player.id } onClick={UI.showOverviewConfirm}>Sign</a>
                <div id={ 'sign-confirm-' + player.id } className="confirm-slider unsigned">
                  <input className="sign-player-salary" type="number" step="0.100" min="0.100" max="99.999" placeholder="Salary"
                    onKeyPress={UI.checkPlayerSalaryInput}
                    onChange={this.changeSignPlayerInput}
                    onBlur={UI.formatSalary}
                    onPaste={UI.blockAction} />
                  <select className="sign-player-duration" defaultValue="0" onChange={this.changeSignPlayerDuration}>
                    <option value="0" disabled>Duration</option>
                    <option value="1">1 year</option>
                    <option value="2">2 years</option>
                    <option value="3">3 years</option>
                    <option value="4">4 years</option>
                    <option value="5">5 years</option>
                  </select>
                  <a className="button rounded cancel" data-target={ 'sign-confirm-' + player.id } onClick={UI.hideOverviewConfirm}>Cancel</a>
                  <a className="button rounded sign" data-id={player.id} data-index={i} onClick={this.signPlayer}>Sign</a>
                </div>
              </li>
            );
          }.bind(this)) }
        </ul>
      </div>
    );
  },

  changeSignPlayerInput: function(e) {
    UI.changePlayerSalary(e);
    if ($(e.target).val() > 0 && $(e.target).siblings('.sign-player-duration').val() !== '0') {
      $(e.target).siblings('.button.sign').addClass('enabled');
    }
  },

  changeSignPlayerDuration: function(e) {
    UI.changePlayerSalary(e);
    if ($(e.target).val() !== '0' && $(e.target).siblings('.sign-player-salary').val() > 0) {
      $(e.target).siblings('.button.sign').addClass('enabled');
    }
  },

  signPlayer: function(e) {
    var id = e.target.getAttribute('data-id'),
        index = e.target.getAttribute('data-index'),
        salary = $('#sign-confirm-' + id + ' input').val(),
        duration = $('#sign-confirm-' + id + ' select').val();
    $('#sign-confirm-' + id).addClass('enagaged');
    this.props.signPlayer(id, index, salary, duration);
  },

  listSigned: function() {
    return (
      <div className="signed">
        <div className="heading">Signed</div>
        <ul className="list">
          { this.props.signed.map(function(player, i) {
            return (
              <li key={ i + player.id } className="item">
                <span className="status">{player.position}</span>
                <span className="name">{player.lastname}, {player.firstname}</span>
                <span className="salary">{player.contract[6]}</span>
                <a className="button" data-target={ 'unsign-confirm-' + player.id } onClick={UI.showOverviewConfirm}>Undo</a>
                <div id={ 'unsign-confirm-' + player.id } className="confirm-slider">
                  <span className="confirm-text">Are you sure?</span>
                  <a data-id={player.id} data-index={i} onClick={this.props.undoSigning}>Yes</a>
                  <span className="confirm-divider"> / </span>
                  <a data-target={ 'unsign-confirm-' + player.id } onClick={UI.hideOverviewConfirm}>No</a>
                </div>
              </li>
            );
          }.bind(this)) }
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
                <a className="button" data-target={ 'undo-confirm-' + player.id } onClick={UI.showOverviewConfirm}>Undo</a>
                <div id={ 'undo-confirm-' + player.id } className="confirm-slider">
                  <span className="confirm-text">Are you sure?</span>
                  <a data-id={player.id} onClick={this.props.undoCreate}>Yes</a>
                  <span className="confirm-divider"> / </span>
                  <a data-target={ 'undo-confirm-' + player.id } onClick={UI.hideOverviewConfirm}>No</a>
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
            var len = Math.max(trade.user.length + trade.picks.user.length, trade.league.length + trade.picks.league.length);
            return (
              <li key={i} className={ 'span-' + len + ' trade item' }>
                <ul className="user">
                  <li className="team">{trade.user_team}</li>
                  { trade.user.map(function(player, j) {
                    return <li key={ j + player.id }>{player.firstname.charAt(0)}. {player.lastname}</li>;
                  }) }
                  { trade.picks.user.map(function(pick, x) {
                    return <li key={pick.id}>{pick.label} Round <span className="year">{ '20' + pick.year }</span></li>;
                  }) }
                </ul>
                <ul className="league">
                  <li className="team">{trade.league_team}</li>
                  { trade.league.map(function(player, k) {
                    return <li key={ k + player.id }>{player.firstname.charAt(0)}. {player.lastname}</li>;
                  }) }
                  { trade.picks.league.map(function(pick, y) {
                    return <li key={pick.id}>{pick.label} Round <span className="year">{ '20' + pick.year }</span></li>;
                  }) }
                </ul>
                <a className="button" data-target={ 'undo-confirm-' + i } onClick={UI.showOverviewConfirm}>Undo</a>
                <div id={ 'undo-confirm-' + i } className="confirm-slider">
                  <span className="confirm-text">Are you sure?</span>
                  <a data-index={i} onClick={this.props.undoTrade}>Yes</a>
                  <span className="confirm-divider"> / </span>
                  <a data-target={ 'undo-confirm-' + i } onClick={UI.hideOverviewConfirm}>No</a>
                </div>
              </li>
            );
          }.bind(this)) }
        </ul>
      </div>
    );
  },


  render: function() {
    var active = this.props.trades.length + this.props.created.length + this.props.signed.length + this.props.unsigned.length,
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
