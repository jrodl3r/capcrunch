'use strict';

var TeamList = require('../../static/teams.js'),
    Messages = require('../../static/messages.js'),
    UI       = require('../../ui.js');

var teams = TeamList,
    maxPlayers = 5,
    selected = '';

var Trades = React.createClass({

  executeTrade: function() {
    if (this.props.tradeData.user.length + this.props.tradeData.picks.user.length &&
        this.props.tradeData.league.length + this.props.tradeData.picks.league.length) {
      this.props.executeTrade();
      UI.confirmAction('trade');
    } else {
      UI.showActionMessage('trade', Messages.trade.min_players);
      if (!this.props.tradeData.league.length) {
        UI.missingTradeInput();
      }
    }
  },

  changeTradeTeam: function(e) {
    this.props.changeTradeTeam(e.target.value);
    e.target.className = '';
    UI.clearAction('trade');
    UI.resetActionMessage();
  },

  addTradeAsset: function(e) {
    var group, year, index, label, players = document.getElementById('trade-player-select');
    e.preventDefault();
    if (this.props.tradeData.league.length + this.props.tradeData.picks.league.length === maxPlayers) {
      UI.showActionMessage('trade', Messages.trade.max_players);
    } else if (players.value !== '0') {
      if (players.options[players.selectedIndex].getAttribute('data-type') === 'pick') {
        index = players.options[players.selectedIndex].getAttribute('data-index');
        year = players.options[players.selectedIndex].getAttribute('data-year');
        label = players.options[players.selectedIndex].getAttribute('data-label');
        this.props.addTradePick('league', year, index, label);
      } else {
        group = players.options[players.selectedIndex].getAttribute('data-group');
        index = players.options[players.selectedIndex].getAttribute('data-index');
        this.props.addTradePlayer('league', null, index, group);
      }
      UI.clearAction('trade');
      UI.resetActionMessage();
      selected = '';
    } else {
      if (!this.props.tradeData.user.length) { UI.missingTradeInput(); }
      UI.showActionMessage('trade', Messages.trade.min_players);
    }
  },

  removeAsset: function(e) {
    var type = e.currentTarget.getAttribute('data-type'),
        index = e.currentTarget.getAttribute('data-index'),
        id = e.currentTarget.getAttribute('data-id');
    e.preventDefault();
    this.props.removeTradePlayer(type, index, id);
  },

  buildPlayerGroup: function(type, players) {
    var list, index;
    list = players.map(function(player, i) {
      if (type === 'user') {
        index = this.props.teamData.players[player.group].map(function(p){ return p.id; }).indexOf(player.id);
        player = this.props.teamData.players[player.group][index];
      }
      return (
        <li key={ i + player.id } id={ 'trade-item-' + player.id } className="active">
          <span className="firstname">{ player.firstname.charAt(0) + '.' } </span><span className="lastname">{player.lastname}</span>
          <a data-type={type} data-index={index} data-id={player.id} className="remove-button" onClick={this.removeAsset}>
            <i className="fa fa-close"></i>
          </a>
        </li>
      );
    }.bind(this));
    return list;
  },

  buildPickGroup: function(type, picks) {
    var list = picks.map(function(pick, i) {
      return (
        <li key={ i + pick.id } id={ 'trade-item-' + pick.id } className="active">
          <span>{pick.label} Round <span className="year">{ '20' + pick.year }</span></span>
          <a className="remove-button"
            data-type={ type === 'user' ? 'user-pick' : 'league-pick' }
            data-index={i} data-id={pick.id} onClick={this.removeAsset}>
            <i className="fa fa-close"></i>
          </a>
        </li>
      );
    }.bind(this));
    return list;
  },

  buildTeamList: function(group, players, queued, acquired) {
    var list, salary, x = String.fromCharCode(10004);
    list = players.map(function(player, j) {
      salary = player.contract[this.props.year];
      if (/UFA/.test(salary)) {
        return <option key={player.id} disabled="disabled">{player.firstname} {player.lastname} ({salary})</option>;
      } else if (selected === player.id) {
        return <option key={player.id} value={player.id} data-group={group} data-index={j} disabled="disabled">{player.firstname} {player.lastname}</option>;
      } else if (acquired.map(function(p){ return p.id; }).indexOf(player.id) !== -1 || queued.indexOf(player.id) !== -1) {
        return (
          <option key={player.id} value={player.id} data-group={group} disabled="disabled">
            {x} {player.firstname} {player.lastname} ({ /(RFA|UFA)/.test(salary) ? salary : player.capnum })
          </option>
        );
      } else if (/RFA/.test(salary)) {
        return <option key={player.id} value={player.id} data-group={group}>{player.firstname} {player.lastname} (RFA)</option>;
      } else { return <option key={player.id} value={player.id} data-group={group} data-index={j}>{player.firstname} {player.lastname} ({player.capnum})</option>; }
    }.bind(this));
    return list;
  },

  buildPicksList: function(year) {
    var picks, round, id, label = '', x = String.fromCharCode(10004), y , z;
    picks = this.props.tradeTeam.picks[ 'Y' + year ].map(function(pick, i) {
      id = this.props.tradeTeam.id + year + 'l' + i;
      round = pick.round;
      if (round === '1') { label = '1st'; }
      else if (round === '2') { label = '2nd'; }
      else if (round === '3') { label = '3rd'; }
      else if (round > 3) { label = round + 'th'; }
      for (y = 0; y < this.props.tradeData.trades.length; y++) {
        for (z = 0; z < this.props.tradeData.trades[y].picks.league.length; z++) {
          if (this.props.tradeData.trades[y].picks.league[z].id === id) {
            return <option key={i} disabled="disabled">{x} {label} Round { pick.status !== 'own' ? <span> (from {pick.from.id})</span> : null }</option>;
          }}}
      if (this.props.tradeData.picks.league.map(function(p){ return p.id; }).indexOf(id) !== -1) {
        return <option key={i} disabled="disabled">{x} {label} Round { pick.status !== 'own' ? <span> (from {pick.from.id})</span> : null }</option>;
      } else if (selected === id) {
        return (
          <option key={i} data-type="pick" data-year={year} data-index={i} data-label={label} value={id} disabled="disabled">
            { pick.from ? <span>{ '20' + year } {label} (from {pick.from.id})</span> : <span>{ '20' + year } {label} Round</span> }
          </option>
        );
      } else if (pick.status === 'own' || pick.status === 'acquired' || pick.status === 'acquired-cond') {
        return (
          <option key={i} data-type="pick" data-year={year} data-index={i} data-label={label} value={id}>
            {label} Round { pick.status !== 'own' ? <span> (from {pick.from.id})</span> : null }
          </option>
        );
      } else if (pick.status === 'traded-acquired') {
        return <option key={i} data-type="pick" data-year={year} data-index={i} data-label={label} value={id}>{label} Round (returned by {pick.from.id})</option>;
      } else if (pick.status === 'acquired-traded') {
        return <option key={i} disabled="disabled">{label} Round <span> (from {pick.from.id} / to {pick.to.id})</span></option>;
      } else {
        return <option key={i} value={ year + '-' + i } disabled="disabled">{label} Round <span> (to {pick.to.id})</span></option>;
      }
    }.bind(this));
    return picks;
  },

  changeTradePlayer: function(e) {
    e.target.className = '';
    selected = e.target.value;
    document.getElementById('add-trade-player').className = 'add-button active';
    UI.resetActionMessage();
    this.forceUpdate();
  },

  render: function() {

    return (
      <div id="trades" className={ this.props.activeTab === 'trades' ? 'tab-area active' + this.props.tradeSize : 'tab-area' }>
        <div className="inner">
          <p id="trade-player-msg">{Messages.trade.heading}</p>
          <div id="trade-drop-area">Drop Players</div>
          <select id="trade-team-select" defaultValue="0"
            className={ this.props.tradeData.league.length ? 'disabled' : '' }
            disabled={ this.props.tradeData.league.length ? 'disabled' : false }
            onChange={this.changeTradeTeam}>
            <option value="0" disabled>Team</option>
          { teams.map(function(team) {
            if (team.id !== this.props.teamData.id) { return <option key={team.id} value={team.id}>{team.id}</option>; }
          }.bind(this)) }
          </select>
          <select id="trade-player-select" defaultValue="0"
            className={ this.props.tradeTeam.id ? '' : 'disabled' }
            disabled={ this.props.tradeTeam.id ? '' : 'disabled' }
            onChange={this.changeTradePlayer}>
            <option value="0" disabled="disabled">Players &amp; Draft Picks</option>
            <option disabled="disabled">─ Forwards ────────</option>
            {this.buildTeamList('forwards', this.props.tradeTeam.forwards, this.props.tradeData.league, this.props.playerData.acquired)}
            <option disabled="disabled">─ Defense ────────</option>
            {this.buildTeamList('defensemen', this.props.tradeTeam.defensemen, this.props.tradeData.league, this.props.playerData.acquired)}
            <option disabled="disabled">─ Goalies ────────</option>
            {this.buildTeamList('goaltenders', this.props.tradeTeam.goaltenders, this.props.tradeData.league, this.props.playerData.acquired)}
            <option disabled="disabled">─ Inactive ────────</option>
            {this.buildTeamList('inactive', this.props.tradeTeam.inactive, this.props.tradeData.league, this.props.playerData.acquired)}
            <option disabled="disabled">─ 2015 Draft ──────</option>
            {this.buildPicksList('15')}
            <option disabled="disabled">─ 2016 Draft ──────</option>
            {this.buildPicksList('16')}
            <option disabled="disabled">─ 2017 Draft ──────</option>
            {this.buildPicksList('17')}
            <option disabled="disabled">─ 2018 Draft ──────</option>
            {this.buildPicksList('18')}
          </select>
          <a id="add-trade-player" className="add-button" onClick={this.addTradeAsset}>
            <i className="fa fa-plus"></i>
          </a>
          <div id="trade-player-breakdown">
        { this.props.tradeData.user.length + this.props.tradeData.picks.user.length
          ? <ul className="active">
              {this.buildPlayerGroup('user', this.props.tradeData.players.user)}
              {this.buildPickGroup('user', this.props.tradeData.picks.user)}
            </ul>
          : <ul className="list-placeholder">
              <li><div>{this.props.teamData.id}</div></li>
            </ul> }
            <div className={ this.props.tradeData.user.length && this.props.tradeData.league.length ? 'trade-marker active' : 'trade-marker' }>
              <i className="fa fa-refresh"></i>
            </div>
        { this.props.tradeData.league.length + this.props.tradeData.picks.league.length
          ? <ul className="active">
              {this.buildPlayerGroup('league', this.props.tradeData.players.league)}
              {this.buildPickGroup('league', this.props.tradeData.picks.league)}
            </ul>
          : <ul className="list-placeholder">
              <li><div>{ this.props.tradeTeam.id ? this.props.tradeTeam.id : '- - -' }</div></li>
            </ul> }
          </div>
          <button id="trade-player-button" onClick={this.executeTrade}>Execute Trade</button>
          <div id="trade-player-confirm" className="transaction-confirm">
            <span>Traded Executed <i className="fa fa-magic"></i></span>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Trades;
