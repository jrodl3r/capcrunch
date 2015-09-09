'use strict';

var UI = require('../../ui.js');

var Overview = React.createClass({

  componentDidMount: function () {
    if (this.props.shareData.link) {
      this.updateCapMeter();
      this.updateOverview();
      // TODO: Animate Capbar (Shared View)
        // if (this.props.capData.players && this.props.shareData.link) {...}
    }
  },

  componentDidUpdate: function () {
    this.updateCapMeter();
    this.updateOverview();
  },

  updateOverview: function () {
    var overview = 86, unsigned = 0, signed = 0, trades = 0, created = 0,
        heading = 24, action_item = 33, trade_item = 20, spacing = 9, user, league, height, x;
    if (this.props.unsigned.length) { unsigned = heading + (this.props.unsigned.length * action_item); }
    $('#overview .unsigned.group').css('height', unsigned);
    if (this.props.signed.length) { signed = heading + (this.props.signed.length * action_item); }
    $('#overview .signed.group').css('height', signed);
    if (this.props.created.length) { created = heading + (this.props.created.length * action_item); }
    $('#overview .created.group').css('height', created);
    if (this.props.trades.length) {
      trades = heading;
      for (x = 0; x < this.props.trades.length; x++) {
        user = this.props.trades[x].user.length + this.props.trades[x].picks.user.length;
        league = this.props.trades[x].league.length + this.props.trades[x].picks.league.length;
        trades = trades + trade_item + (Math.max(user, league) * trade_item) + spacing;
      }
    }
    height = unsigned + signed + created + trades + overview;
    $('#overview .trades.group').css('height', trades);
    if (height > overview) { $('#overview').addClass('engaged').css('height', height); }
    else { $('#overview').removeClass('engaged').css('height', overview); }
    $('.confirm-slider.active').not('.engaged').removeClass('active');
    $('.confirm-slider input, .confirm-slider select').removeClass('active');
  },

  updateCapMeter: function () {
    var bar = Math.ceil(this.props.capData.hit * 3);
    bar = bar <= 215 ? bar : 215;
    $('#capbar .inner, #capbar .fx, #capbar .glow').css('width', bar);
    if (bar < 141) { $('#capbar .space.outside').css('left', bar); }
    else { $('#capbar .space.inside').css('left', 'initial'); }
  },

  listUnsigned: function() {
    var count = 0;
    return (
      <div>
        <div className="heading">Unsigned</div>
        <ul className="list">
          { this.props.unsigned.map(function(player, i) {
            count = count + 2;
            return (
              <li key={i} className="item">
              <span className="status">{/(UFA|RFA)/.test(player.prev_contract) ? player.prev_contract : player.contract[6] }</span>
                <span className="name">{player.firstname} {player.lastname}</span>
                <a className="button" data-target={ 'sign-confirm-' + player.id } onClick={this.showConfirm}>Sign</a>
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
                  <a className="button rounded cancel" data-target={ 'sign-confirm-' + player.id } tabIndex={ i * count + 4 }
                     onClick={this.hideConfirm}>Cancel</a>
                  <a className="button rounded sign" data-id={player.id} data-index={i} tabIndex={ i * count + 3 } onClick={this.signPlayer}
                     onKeyDown={this.triggerSignPlayer}>Sign</a>
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
    if (salary && duration !== '0') {
      $('.confirm-slider.active').removeClass('active enagaged');
      $('.confirm-slider input, .confirm-slider select').removeClass('active');
      $('.confirm-slider .button.sign.enabled').removeClass('enabled');
    }
    this.props.signPlayer(id, index, salary, duration);
  },

  triggerSignPlayer: function(e) { if (e.keyCode === 13) { this.signPlayer(e); } },

  listSigned: function() {
    return (
      <div>
        <div className="heading">Signed</div>
        <ul className="list">
          { this.props.signed.map(function(player, i) {
            return (
              <li key={i} className="item">
                <span className="status">{player.position}</span>
                <span className="name">{player.firstname} {player.lastname}</span>
                <span className="salary">
                  <span className="at">&#64;</span> {parseFloat(player.contract[6])}
                  <span className="currency">M</span>
                  <span className="years">
                    <span className="times"> &#215; </span>
                    <span className="duration">{player.duration}</span>yr{ player.duration > 1 ? 's' : '' }
                  </span>
                </span>
                <a className="button undo" data-target={ 'unsign-confirm-' + player.id } onClick={this.showConfirm}>Undo</a>
                <div id={ 'unsign-confirm-' + player.id } className="confirm-slider">
                  <span className="confirm-text">Are you sure?</span>
                  <a data-id={player.id} data-index={i} onClick={this.undoSigning}>Yes</a>
                  <span className="confirm-divider"> / </span>
                  <a data-target={ 'unsign-confirm-' + player.id } onClick={this.hideConfirm}>No</a>
                </div>
              </li>
            );
          }.bind(this)) }
        </ul>
      </div>
    );
  },

  undoSigning: function (e) {
    $('.confirm-slider.active').removeClass('active enagaged');
    this.props.undoSigning(e);
  },

  listCreated: function() {
    return (
      <div>
        <div className="heading">Created</div>
        <ul className="list">
          { this.props.created.map(function(player, i) {
            return (
              <li key={i} className="item">
                <span className="status">{player.position}</span>
                <span className="name">{player.firstname} {player.lastname}</span>
                <span className="salary">
                  <span className="at">&#64;</span> {parseFloat(player.contract[6])}
                  <span className="currency">M</span>
                  <span className="years">
                    <span className="times"> &#215; </span>
                    <span className="duration">{player.duration}</span>yr{ player.duration > 1 ? 's' : '' }
                  </span>
                </span>
                <a className="button undo" data-target={ 'undo-confirm-' + player.id } onClick={this.showConfirm}>Undo</a>
                <div id={ 'undo-confirm-' + player.id } className="confirm-slider">
                  <span className="confirm-text">Are you sure?</span>
                  <a data-id={player.id} onClick={this.props.undoCreate}>Yes</a>
                  <span className="confirm-divider"> / </span>
                  <a data-target={ 'undo-confirm-' + player.id } onClick={this.hideConfirm}>No</a>
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
      <div>
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
                    return <li key={pick.id} className="pick">{pick.label} Round <span className="year">{ '20' + pick.year }</span></li>;
                  }) }
                </ul>
                <ul className="league">
                  <li className="team">{trade.league_team}</li>
                  { trade.league.map(function(player, k) {
                    return <li key={ k + player.id }>{player.firstname.charAt(0)}. {player.lastname}</li>;
                  }) }
                  { trade.picks.league.map(function(pick, y) {
                    return <li key={pick.id} className="pick">{pick.label} Round <span className="year">{ '20' + pick.year }</span></li>;
                  }) }
                </ul>
                <a className="button undo" data-target={ 'undo-confirm-' + i } onClick={this.showConfirm}>Undo</a>
                <div id={ 'undo-confirm-' + i } className="confirm-slider">
                  <span className="confirm-text">Are you sure?</span>
                  <a data-index={i} onClick={this.props.undoTrade}>Yes</a>
                  <span className="confirm-divider"> / </span>
                  <a data-target={ 'undo-confirm-' + i } onClick={this.hideConfirm}>No</a>
                </div>
              </li>
            );
          }.bind(this)) }
        </ul>
      </div>
    );
  },

  hideConfirm: function (e) {
    e.preventDefault();
    $('.confirm-slider.active').removeClass('active');
  },

  showConfirm: function (e) {
    e.preventDefault();
    $('.confirm-slider.active, .confirm-slider input, .confirm-slider select').removeClass('active');
    $('.confirm-slider .button.sign.enabled').removeClass('enabled');
    $('.confirm-slider .sign-player-salary').val('');
    $('.confirm-slider .sign-player-duration').val(0);
    $('#' + e.target.getAttribute('data-target')).addClass('active engaged');
  },

  changeView: function(e) {
    e.preventDefault();
    $('#team-grid div.active').removeClass('active');
    $('#team-grid div.' + this.props.userTeam).addClass('active');
    this.props.changeView('teams');
  },

  // showExpandedView: function () {
  //   var height = this.getExpandedHeight();
  //   if (height > overview_height && !this.props.shareData.link) {
  //     $('#overview').attr('class', 'panel active').css('height', height);
  //   }
  // },

  // hideExpandedView: function () {
  //   if (!this.props.shareData.link) {
  //     $('#overview').attr('class', 'panel').css('height', 90);
  //   }
  // },

  render: function() {
    var gm_status = this.props.capData.players ? ' active' : '',
        cap_size = this.props.capData.hit * 3,
        show_hit = cap_size >= 60,
        cap_inside = cap_size >= 140 ? ' active' : '',
        cap_outside = cap_size < 140 ? ' active' : ' disabled';

    return (
      <div id="overview" className={ this.props.shareData.link ? 'panel shared active' : 'panel' + gm_status }>
        <div className="title">GM Overview</div>
        <div className={ this.props.capData.players ? 'roster_size active' : 'roster_size' }>
          <span className="num">{this.props.capData.players ? this.props.capData.players : 1 } </span>
          Player{ this.props.capData.players > 1 ? 's' : null }
        </div>
        <div id="capbar">
          <ul id="roster_info">
            <li className={this.props.unsigned.length ? 'unsigned active' : 'unsigned' }>
              <span className="num">{this.props.unsigned.length}</span> <span>Unsigned</span>
            </li>
            <li className={ this.props.signed.length ? 'active' : '' }>
              <span className="num">{this.props.signed.length} </span> <span>Signed</span>
            </li>
            <li className={ this.props.trades.length ? 'active' : '' }>
              <span className="num">{this.props.trades.length} </span>
              <span>Trade{!this.props.trades.length || this.props.trades.length > 1 ? 's' : ''}</span>
            </li>
            <li className={ this.props.created.length ? 'active' : '' }>
              <span className="num">{this.props.created.length} </span> <span>Created</span>
            </li>
          </ul>
          <div className="outer">
            <div className="inner">
              <span className={ show_hit ? 'hit active' : 'hit' }>
                <span className="label">Hit</span> { this.props.capData.hit }
              </span>
          { this.props.capData.space > 0
            ? <span className={ 'space inside' + cap_inside }>
                <span className="label">Space</span> { this.props.capData.space }
              </span>
            : <span className={ 'space overage inside' + cap_inside }>
                <span className="label">Cap Overage</span> { this.props.capData.space }
              </span> }
              <div className="bar"></div>
            </div>
            <span className={ this.props.capData.hit !== '0.000' ? 'space outside enabled' + cap_outside : 'space outside' + cap_outside }>
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
          <div className={ this.props.unsigned.length ? 'unsigned active group' : 'unsigned group' }>{this.listUnsigned()}</div>
          <div className={ this.props.signed.length ? 'signed active group' : 'signed group' }>{this.listSigned()}</div>
          <div className={ this.props.created.length ? 'created active group' : 'created group' }>{this.listCreated()}</div>
          <div className={ this.props.trades.length ? 'trades active group' : 'trades group' }>{this.listTrades()}</div>
        </div>
      </div>
    );
  }
});
// onMouseEnter={this.showExpandedView} onMouseLeave={this.hideExpandedView}
// <div id="overview-disabled-cover"
//   className={ this.props.userTeam && this.props.userTeam !== this.props.activeTeam ? 'active' : '' }>
//   <span className="info-bubble"><strong>Allstar-Mode</strong> is enabled whenenver the active team does not match your roster players.</span>
//   <p>Allstar Mode <i className="fa fa-info-circle"></i><br/>
//     <a onClick={this.changeView}>Switch back to active team ({this.props.userTeam})</a>
//   </p>
// </div>
module.exports = Overview;
