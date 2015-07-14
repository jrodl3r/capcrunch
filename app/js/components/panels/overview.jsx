'use strict';

var UI = require('../../ui.js');

var Overview = React.createClass({

  componentDidUpdate: function () {
    this.updateCapMeter();
    if ($('#overview').hasClass('active')) {
      $('#overview').css('height', this.getExpandedHeight());
    }
    $('.confirm-slider.active').not('.enagaged').removeClass('active');
  },

  componentDidMount: function () {
    if (this.props.shareData.link) {
      this.updateCapMeter();
      if ($('#overview').hasClass('active')) {
        $('#overview').css('height', this.getExpandedHeight());
      }
    }
  },

  listUnsigned: function() {
    var count = 0;
    // <div className="heading">{this.props.unsigned.length} Unsigned</div>
    return (
      <div className="unsigned">
        <div className="heading">Unsigned</div>
        <ul className="list">
          { this.props.unsigned.map(function(player, i) {
            count = count + 2;
            return (
              <li key={ i + player.id } className="item">
                <span className="status">{player.contract[6]}</span>
                <span className="name">{player.lastname}, {player.firstname}</span>
                <a className="button" data-target={ 'sign-confirm-' + player.id } onClick={UI.showOverviewConfirm}>Sign</a>
                <div id={ 'sign-confirm-' + player.id } className="confirm-slider unsigned">
                  <input className="sign-player-salary" type="number" step="0.100" min="0.100" max="99.999" placeholder="Salary" tabIndex={ i * count + 1 }
                    onKeyPress={UI.checkPlayerSalaryInput}
                    onChange={this.changeSignPlayerInput}
                    onBlur={UI.formatSalary}
                    onPaste={UI.blockAction} />
                  <select className="sign-player-duration" defaultValue="0" tabIndex={ i * count + 2 } onChange={this.changeSignPlayerDuration}>
                    <option value="0" disabled>Duration</option>
                    <option value="1">1 year</option>
                    <option value="2">2 years</option>
                    <option value="3">3 years</option>
                    <option value="4">4 years</option>
                    <option value="5">5 years</option>
                  </select>
                  <a className="button rounded sign" data-id={player.id} data-index={i} tabIndex={ i * count + 3 } onClick={this.signPlayer}
                     onKeyDown={this.triggerSignPlayer}>Sign</a>
                  <a className="button rounded cancel" data-target={ 'sign-confirm-' + player.id } tabIndex={ i * count + 4 }
                     onClick={UI.hideOverviewConfirm}>Cancel</a>
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

  triggerSignPlayer: function(e) { if (e.keyCode === 13) { this.signPlayer(e); } },

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
                <span className="salary">{player.contract[6]} <span>/</span> {player.duration}yr</span>
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
                <span className="salary">{player.contract[6]} <span>/</span> {player.duration}yr</span>
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

  changeView: function(e) {
    e.preventDefault();
    $('#team-grid div.active').removeClass('active');
    $('#team-grid div.' + this.props.userTeam).addClass('active');
    this.props.changeView('teams');
  },

  showExpandedView: function () {
    var height = this.getExpandedHeight();
    if (height > 66 && !this.props.shareData.link) {
      $('#overview').attr('class', 'panel active').css('height', height);
    }
  },

  hideExpandedView: function () {
    if (!this.props.shareData.link) {
      $('#overview').attr('class', 'panel').css('height', 88);
    }
  },

  // if (this.props.trades.length) {
  //   height = height + 28;
  //   for (x = 0; x < this.props.trades.length; x++) {
  //     height = height + 28 + (Math.max(this.props.trades[x].user.length + this.props.trades[x].picks.user.length, this.props.trades[x].league.length + this.props.trades[x].picks.league.length) * 20);
  //   }}
  // if (haveItems && this.props.userTeam && this.props.userTeam !== this.props.activeTeam) {
  //   $('#overview').css('height', 180);
  // } else {
  //   if (haveItems > 1) {
  //     if (this.props.signed.length) { height = height + 28 + (this.props.signed.length * 33); }
  //     if (this.props.unsigned.length) { height = height + 28 + (this.props.unsigned.length * 33); }
  //     if (this.props.created.length) { height = height + 28 + (this.props.created.length * 33); }
  //     $('#overview').css('height', height);
  //   } else if (haveItems === 1) {
  //     if (this.props.trades.length) {
  //       $('#overview').css('height', height);
  //     } else { $('#overview').css('height', 95); }
  //   } else { $('#overview').css('height', 0); }
  // }
  // $('.confirm-slider.active').not('.enagaged').removeClass('active');

  getExpandedHeight: function () {
    var overview = 66, title = 26, height = 0, x;
    if (this.props.unsigned.length) {
      height = title + (this.props.unsigned.length * 33);
    }
    if (this.props.signed.length) {
      height = height + title + (this.props.signed.length * 33);
    }
    if (this.props.created.length) {
      height = height + title + (this.props.signed.length * 33);
    }
    if (this.props.trades.length) {
      height = height + title;
      for (x = 0; x < this.props.trades.length; x++) {
        height = height + (Math.max(this.props.trades[x].user.length + this.props.trades[x].picks.user.length, this.props.trades[x].league.length + this.props.trades[x].picks.league.length) * 20);
      }
    }
    return overview + height;
  },

  updateCapMeter: function () {
    var bar = Math.ceil(this.props.capData.hit * 3);
    bar = bar <= 215 ? bar : 215;
    $('#capbar .inner, #capbar .fx, #capbar .glow').css('width', bar);
    if (bar < 140) { $('#capbar .space.outside').css('left', bar); }
    else { $('#capbar .space.inside').css('left', 'initial'); }
  },


  render: function() {
    var cap_size = this.props.capData.hit * 3,
        show_hit = cap_size >= 60,
        space_inside = cap_size >= 140 ? ' active' : '',
        space_outside = cap_size < 140 ? ' active' : ' disabled',
        show_unsigned = this.props.unsigned.length ? ' wide' : '';

    return (
      <div id="overview" className={ this.props.shareData.link ? 'panel active' : 'panel' }
        onMouseEnter={this.showExpandedView} onMouseLeave={this.hideExpandedView}>
        <div className="title">GM Overview</div>
        <ul className="summary">
      { this.props.unsigned.length
        ? <li className="unsigned">
            <span className="num">{this.props.unsigned.length} </span> Unsigned
          </li> : null }
          <li className={ this.props.signed.length ? 'active' : '' }>
            <span className="num">{this.props.signed.length} </span> Signed
          </li>
          <li className={ this.props.trades.length ? 'active' : '' }>
            <span className="num">{this.props.trades.length} </span>
            Trade{!this.props.trades.length || this.props.trades.length > 1 ? 's' : ''}
          </li>
          <li className={ this.props.created.length ? 'active' : '' }>
            <span className="num">{this.props.created.length} </span> Created
          </li>
          <li className={ this.props.capData.players ? 'players active' + show_unsigned : 'players inactive' }>
            <span className="num">{ this.props.capData.players ? this.props.capData.players : 'No' } </span>
            Player{ !this.props.capData.players || this.props.capData.players > 1 ? 's' : ''}
          </li>
          <li className="shade"></li>
        </ul>
        <div id="capbar">
          <div className="outer">
            <div className="inner">
              <span className={ show_hit ? 'hit active' : 'hit' }>
                <span className="label">Hit</span> { this.props.capData.hit }
              </span>
          { this.props.capData.space > 0
            ? <span className={ 'space inside' + space_inside }>
                <span className="label">Space</span> { this.props.capData.space }
              </span>
            : <span className={ 'space overage inside' + space_inside }>
                <span className="label">Cap Overage</span> { this.props.capData.space }
              </span> }
              <div className="bar"></div>
            </div>
            <span className={ this.props.capData.hit !== '0.000' ? 'space outside enabled' + space_outside : 'space outside' + space_outside }>
              <span className="label">Space</span> { this.props.capData.space }
            </span>
            <span className="cap">
              <span className="label">Cap</span> { this.props.capData.cap }
            </span>
            <div className={ this.props.capData.hit > 0 ? 'fx active' : 'fx' }></div>
            <div className={ this.props.capData.hit > 0 ? 'glow active' : 'glow' }></div>
          </div>
          <div className="shade"></div>
        </div>
        <div className="inner">
          { this.props.unsigned.length ? this.listUnsigned() : null }
          { this.props.signed.length ? this.listSigned() : null }
          { this.props.created.length ? this.listCreated() : null }
          { this.props.trades.length ? this.listTrades() : null }
        </div>
      </div>
    );
  }
});
// <div id="overview-disabled-cover"
//   className={ this.props.userTeam && this.props.userTeam !== this.props.activeTeam ? 'active' : '' }>
//   <span className="info-bubble"><strong>Allstar-Mode</strong> is enabled whenenver the active team does not match your roster players.</span>
//   <p>Allstar Mode <i className="fa fa-info-circle"></i><br/>
//     <a onClick={this.changeView}>Switch back to active team ({this.props.userTeam})</a>
//   </p>
// </div>
module.exports = Overview;
