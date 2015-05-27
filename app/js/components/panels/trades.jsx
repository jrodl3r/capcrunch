'use strict';

var TeamList = require('../../static/teams.js'),
    Messages = require('../../static/messages.js'),
    UI       = require('../../ui.js');

var Trades = React.createClass({

  getDefaultProps: function() {
    return { teams : TeamList, maxPlayers : 5 };
  },

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
    UI.clearAction('trade-player');
    UI.resetActionMessage();
  },

  addTradePlayer: function(e) {
    var group, index, players = document.getElementById('trade-player-select');
    e.preventDefault();
    if (this.props.tradeData.league.length === this.props.maxPlayers) {
      UI.showActionMessage('trade', Messages.trade.max_players);
    } else if (players.value !== '0') {
      group = players.options[players.selectedIndex].getAttribute('data-group');
      index = players.options[players.selectedIndex].getAttribute('data-index');
      this.props.addTradePlayer('league', null, index, group);
      UI.clearAction('trade-player');
      UI.resetActionMessage();
    } else {
      if (!this.props.tradeData.user.length) {
        UI.missingTradeInput();
      }
      UI.showActionMessage('trade', Messages.trade.min_players);
    }
  },

  removeLeaguePlayer: function(e) {
    var players = document.getElementById('trade-player-select'),
        count = players.options.length;
    e.preventDefault();
    this.props.removeTradePlayer('league', e.currentTarget.id);
    for (var i = 0; i < count; i++) {
      if (players.options[i].value === e.currentTarget.id) {
        players.options[i].disabled = false;
      }
    }
  },

  removeUserPlayer: function(e) {
    e.preventDefault();
    this.props.removeTradePlayer('user', e.currentTarget.id);
  },

  buildPlayerGroup: function(players, type) {
    var list = players.map(function(player) {
      player = type === 'user' ? this.props.teamData.players[player.group][player.index] : player;
      return (
        <li key={player.id} id={player.id + '-trade-item'}>
          <span>{ player.firstname.charAt(0) + '.' } </span><span className="lastname">{player.lastname}</span>
          <a id={player.id} className="remove-button" onClick={ type === 'user' ? this.removeUserPlayer : this.removeLeaguePlayer }>
            <i className="fa fa-close"></i>
          </a>
        </li>
      );
    }.bind(this));
    return list;
  },

  buildTeamList: function(players, group) {
    var league = this.props.tradeData.league,
        count = this.props.playerData.acquired.length,
        x = String.fromCharCode(10004),
        acquired = [], list, i;
    for (i = 0; i < count; i++) {
      acquired.push(this.props.playerData.acquired[i].id);
    }
    list = players.map(function(player, j) {
      if (acquired.indexOf(player.id) !== -1 || league.indexOf(player.id) !== -1) {
        return (
          <option key={player.id} value={player.id} data-group={group} disabled="disabled">
            {x} {player.firstname} {player.lastname} ({player.contract[0]})
          </option>
        );
      } else {
        return (
          <option key={player.id} value={player.id} data-group={group} data-index={j}>
            {player.firstname} {player.lastname} ({player.contract[0]})
          </option>
        );
      }
    });
    return list;
  },

  changeTradePlayer: function(e) {
    e.target.className = '';
    document.getElementById('add-trade-player').className = 'add-button active';
    UI.resetActionMessage();
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
            {this.props.teams.map(function(team) {
              if (team.id !== this.props.teamData.id) {
                return <option key={team.id} value={team.id}>{team.id}</option>;
              }
            }.bind(this))}
          </select>
          <select id="trade-player-select" defaultValue="0"
            className={ this.props.tradeTeam.id ? '' : 'disabled' }
            disabled={ this.props.tradeTeam.id ? '' : 'disabled' }
            onChange={this.changeTradePlayer}>
            <option value="0" disabled="disabled">Players</option>
            <option disabled="disabled">─ Forwards ────────</option>
            {this.buildTeamList(this.props.tradeTeam.forwards, 'forwards')}
            <option disabled="disabled">─ Defense ────────</option>
            {this.buildTeamList(this.props.tradeTeam.defensemen, 'defensemen')}
            <option disabled="disabled">─ Goalies ────────</option>
            {this.buildTeamList(this.props.tradeTeam.goaltenders, 'goaltenders')}
            <option disabled="disabled">─ Inactive ────────</option>
            {this.buildTeamList(this.props.tradeTeam.inactive, 'inactive')}
          </select>
          <a id="add-trade-player" className="add-button" onClick={this.addTradePlayer}>
            <i className="fa fa-plus"></i>
          </a>
          <div id="trade-player-breakdown">
        { this.props.tradeData.user.length
          ? <ul className="active">{this.buildPlayerGroup(this.props.tradeData.players.user, 'user')}</ul>
          : <ul className="list-placeholder">
              <li><div>{this.props.teamData.id}</div></li>
            </ul> }
            <div className={ this.props.tradeData.user.length && this.props.tradeData.league.length ? 'trade-marker active' : 'trade-marker' }>
              <i className="fa fa-refresh"></i>
            </div>
        { this.props.tradeData.league.length
          ? <ul className="active">{this.buildPlayerGroup(this.props.tradeData.players.league, 'league')}</ul>
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
