// CapCrunch Trade Player Tab (Transactions Panel)
// ==================================================
'use strict';

var TeamList = require('../../static/teams.js');

var Trades = React.createClass({
    getDefaultProps: function() {
      return {
        teams       : TeamList,
        messages    : {
          heading   : 'Execute a blockbuster trade for your team:'
        }
      };
    },
    handleChangeTradeTeam: function(e) {
      var team_id = e.target.value;
      this.props.handleChangeTradeTeam(team_id);
      document.getElementById('trade-players-select').selectedIndex = 0;
    },
    addPassiveTeamPlayer: function(e) {
      e.preventDefault();
      var team_select  = document.getElementById('trade-team-select'),
          player_item  = document.getElementById('trade-players-select'),
          player_id    = player_item.value,
          player_group = player_item.options[player_item.selectedIndex].getAttribute('data-group'),
          playerData   = this.props.playerData;
      var player = playerData[player_group].filter(function(player_obj) {
        return player_obj.id === player_id;
      })[0];
      this.props.handleAddTradePlayer('passive', player);
      player_item.options[player_item.selectedIndex].disabled = true;
      player_item.options[0].selected = true;
      team_select.disabled = true;
      team_select.className = 'disabled';
    },
    removePassiveTeamPlayer: function(e) {
      e.preventDefault();
      var team_select  = document.getElementById('trade-team-select'),
          player_item  = document.getElementById('trade-players-select'),
          player_id    = e.currentTarget.dataset.id;
      this.props.handleRemoveTradePlayer('passive', player_id);
      for (var i = 0; i < player_item.options.length; i++) {
        if (player_item.options[i].value === player_id) {
          player_item.options[i].disabled = false;
        }
      }
    },
    removeActiveTeamPlayer: function(e) {
      e.preventDefault();
      var player_id = e.currentTarget.dataset.id;
      this.props.handleRemoveTradePlayer('active', player_id);
    },
    render: function() {
      var activeTeam     = this.props.activeTrade.active.id ? this.props.activeTrade.active.id : this.props.activeTeam,
          passiveTeam    = this.props.activeTrade.passive.id,
          haveActive     = this.props.activeTrade.active.id_list.length ? true : false,
          havePassive    = this.props.activeTrade.passive.id_list.length ? true : false,
          activePlayers  = this.props.activeTrade.active.players.map(function(player) {
            return (
              <li key={player.id}>
                {player.firstname.charAt(0)}. {player.lastname}
                <a className="remove-button" data-id={player.id} onClick={this.removeActiveTeamPlayer}>
                  <i className="fa fa-remove"></i>
                </a>
              </li>
            );
          }.bind(this)),
          passivePlayers = this.props.activeTrade.passive.players.map(function(player) {
            return (
              <li key={player.id}>
                {player.firstname.charAt(0)}. {player.lastname}
                <a className="remove-button" data-id={player.id} onClick={this.removePassiveTeamPlayer}>
                  <i className="fa fa-remove"></i>
                </a>
              </li>
            );
          }.bind(this));

      return (
        <div id="trades" className="tab-area active">
          <div className="inner">
            <p id="tradeplayer-msg">{this.props.messages.heading}</p>
            <div id="trade-drop-area">
              Drop Players
              <div id="trade-drop-area-cover"
                onDragEnter={this.props.handleTradeDragEnter}
                onDragLeave={this.props.handleTradeDragLeave}>
              </div>
            </div>
            <select id="trade-team-select" defaultValue="0"
              className={ havePassive ? 'disabled' : null }
              disabled={ havePassive ? 'disabled' : false }
              onChange={this.handleChangeTradeTeam}>
              <option value="0" disabled>Team</option>
              {this.props.teams.map(function(team) {
                if (team.id !== activeTeam) {
                  return <option key={team.id} value={team.id}>{team.id}</option>;
                }
              })}
            </select>
            <select id="trade-players-select" defaultValue="0">
              <option value="0" disabled>Players</option>
              { this.props.playerData.forwards.length ? <option disabled>─ Forwards ────────</option> : null }
              {this.props.playerData.forwards.map(function(player, i) {
                return (
                  <option key={player.id} value={player.id} data-group="forwards">
                    {player.firstname} {player.lastname}
                  </option>
                );
              })}
              { this.props.playerData.defensemen.length ? <option disabled>─ Defense ────────</option> : null }
              {this.props.playerData.defensemen.map(function(player, i) {
                return (
                  <option key={player.id} value={player.id} data-group="defensemen">
                    {player.firstname} {player.lastname}
                  </option>
                );
              })}
              { this.props.playerData.goaltenders.length ? <option disabled>─ Goalies ────────</option> : null }
              {this.props.playerData.goaltenders.map(function(player, i) {
                return (
                  <option key={player.id} value={player.id} data-group="goaltenders">
                    {player.firstname} {player.lastname}
                  </option>
                );
              })}
              { this.props.playerData.inactive.length ? <option disabled>─ Inactive ────────</option> : null }
              {this.props.playerData.inactive.map(function(player, i) {
                return (
                  <option key={player.id} value={player.id} data-group="inactive">
                    {player.firstname} {player.lastname}
                  </option>
                );
              })}
            </select>
            <a id="trade-player-add-player" className="add-button" title="Add Player" onClick={this.addPassiveTeamPlayer}>
              <i className="fa fa-plus"></i>
            </a>
            <div id="trade-player-breakdown">
          { haveActive
            ? <ul id="trade-player-active-list" className="active">{activePlayers}</ul>
            : <ul className="trade-player-list-placeholder"><li>{activeTeam}</li></ul> }
              <div className="trade-marker">
                <i className="fa fa-refresh"></i>
              </div>
          { havePassive
            ? <ul id="trade-player-passive-list" className="active">{passivePlayers}</ul>
            : <ul className="trade-player-list-placeholder"><li>{ passiveTeam ? passiveTeam : '- - -' }</li></ul> }
            </div>
            <button id="trade-player-button" onClick={this.props.handleTradeExecution}>Execute Trade</button>
            <div id="trade-player-confirm" className="transaction-confirm">
              Traded Executed <i className="fa fa-magic"></i>
            </div>
          </div>
        </div>
      );
    }
});

module.exports = Trades;
