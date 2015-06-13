'use strict';

var TeamList = require('../../static/teams.js'),
    Messages = require('../../static/messages.js'),
    UI       = require('../../ui.js');

var teams = TeamList,
    maxPlayers = 5,
    selectedPlayer = '';

var Trades = React.createClass({

  executeTrade: function() {
    if (this.props.tradeData.user.length && this.props.tradeData.league.length) {
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

  addTradePlayer: function(e) {
    var group, index, players = document.getElementById('trade-player-select');
    e.preventDefault();
    if (this.props.tradeData.league.length === maxPlayers) {
      UI.showActionMessage('trade', Messages.trade.max_players);
    } else if (players.value !== '0') {

      if (players.options[players.selectedIndex].getAttribute('data-type') === 'pick') {
        this.props.addTradePick(players.value);
      } else {
        group = players.options[players.selectedIndex].getAttribute('data-group');
        index = players.options[players.selectedIndex].getAttribute('data-index');
        this.props.addTradePlayer('league', null, index, group);
      }
      UI.clearAction('trade');
      UI.resetActionMessage();
      selectedPlayer = '';
    } else {
      if (!this.props.tradeData.user.length) { UI.missingTradeInput(); }
      UI.showActionMessage('trade', Messages.trade.min_players);
    }
  },

  removePlayer: function(e) {
    var type = e.currentTarget.getAttribute('data-type'),
        index = e.currentTarget.getAttribute('data-index'),
        id = e.currentTarget.getAttribute('data-id');
    e.preventDefault();
    this.props.removeTradePlayer(type, index, id);
  },

  buildPlayerGroup: function(type, players) {
    var list, index = null;
    list = players.map(function(player) {
      if (type === 'user') {
        index = this.props.teamData.players[player.group].map(function(p){ return p.id; }).indexOf(player.id);
        player = this.props.teamData.players[player.group][index];
      }
      return (
        <li key={player.id} id={player.id + '-trade-item'}>
          <span>{ player.firstname.charAt(0) + '.' } </span><span className="lastname">{player.lastname}</span>
          <a data-type={type} data-index={index} data-id={player.id} className="remove-button" onClick={this.removePlayer}>
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
        return <option key={player.id} value={player.id} data-group={group} disabled="disabled">{player.firstname} {player.lastname} ({salary})</option>;
      } else if (selectedPlayer === player.id) {
        return <option key={player.id} value={player.id} data-group={group} data-index={j} disabled="disabled">{player.firstname} {player.lastname}</option>;
      } else if (acquired.map(function(p){ return p.id; }).indexOf(player.id) !== -1 || queued.indexOf(player.id) !== -1) {
        return <option key={player.id} value={player.id} data-group={group} disabled="disabled">{x} {player.firstname} {player.lastname} ({ /(RFA|UFA)/.test(salary) ? salary : player.capnum })</option>;
      } else if (/RFA/.test(salary)) {
        return <option key={player.id} value={player.id} data-group={group}>{player.firstname} {player.lastname} (RFA)</option>;
      } else { return <option key={player.id} value={player.id} data-group={group} data-index={j}>{player.firstname} {player.lastname} ({player.capnum})</option>; }
    }.bind(this));
    return list;
  },

  buildPicksList: function(year) {
    var picks, round = '', label = '', x = String.fromCharCode(10004);
    picks = this.props.tradeTeam.picks[ 'Y' + year ].map(function(pick, i) {
      if (pick.round === 1) { label = '1st'; }
      else if (pick.round === 2) { label = '2nd'; }
      else if (pick.round === 3) { label = '3rd'; }
      else if (pick.round > 3) { label = pick.round + 'th'; }
      if(pick.status === 'own' || pick.status === 'acquired' || pick.status === 'acquired-cond') {
        return (
          <option key={i} value={ 'Y' + year + '-' + i } data-type="pick" data-title={ label + ' Round Pick (20' + year + ')' }>
            Round {pick.round} { pick.status === 'own' ? <span> - Own</span> : <span> - (From {pick.from.id})</span> }
          </option>
        );
      } else {
        return <option key={i} value={ year + '-' + i } disabled="disabled">Round {pick.round} <span> - (To {pick.to.id})</span></option>;
      }
    }.bind(this));
    return picks;
  },

  changeTradePlayer: function(e) {
    e.target.className = '';
    selectedPlayer = e.target.value;
    document.getElementById('add-trade-player').className = 'add-button active';
    UI.resetActionMessage();
    this.forceUpdate();
  },

  render: function() {

    return (
      <div id="trades" className={ this.props.activeTab === 'trades' ? 'tab-area active' + this.props.tradeSize : 'tab-area' }>
        <div className="inner">
          <p id="trade-player-msg">Execute a blockbuster trade for your team:</p>
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
            <option value="0" disabled="disabled">Players</option>
            <option disabled="disabled">─ Forwards ────────</option>
            {this.buildTeamList('forwards', this.props.tradeTeam.forwards, this.props.tradeData.league, this.props.playerData.acquired)}
            <option disabled="disabled">─ Defense ────────</option>
            {this.buildTeamList('defensemen', this.props.tradeTeam.defensemen, this.props.tradeData.league, this.props.playerData.acquired)}
            <option disabled="disabled">─ Goalies ────────</option>
            {this.buildTeamList('goaltenders', this.props.tradeTeam.goaltenders, this.props.tradeData.league, this.props.playerData.acquired)}
            <option disabled="disabled">─ Inactive ────────</option>
            {this.buildTeamList('inactive', this.props.tradeTeam.inactive, this.props.tradeData.league, this.props.playerData.acquired)}
            <option disabled="disabled">─ 2015 Picks ──────</option>
            {this.buildPicksList('15')}
            <option disabled="disabled">─ 2016 Picks ──────</option>
            {this.buildPicksList('16')}
            <option disabled="disabled">─ 2017 Picks ──────</option>
            {this.buildPicksList('17')}
            <option disabled="disabled">─ 2018 Picks ──────</option>
            {this.buildPicksList('18')}
          </select>
          <a id="add-trade-player" className="add-button" onClick={this.addTradePlayer}>
            <i className="fa fa-plus"></i>
          </a>
          <div id="trade-player-breakdown">
        { this.props.tradeData.user.length
          ? <ul className="active">{this.buildPlayerGroup('user', this.props.tradeData.players.user)}</ul>
          : <ul className="list-placeholder">
              <li><div>{this.props.teamData.id}</div></li>
            </ul> }
            <div className={ this.props.tradeData.user.length && this.props.tradeData.league.length ? 'trade-marker active' : 'trade-marker' }>
              <i className="fa fa-refresh"></i>
            </div>
        { this.props.tradeData.league.length
          ? <ul className="active">{this.buildPlayerGroup('league', this.props.tradeData.players.league)}</ul>
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
