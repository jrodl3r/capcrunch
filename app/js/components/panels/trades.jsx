// CapCrunch Trade Player Tab (Transactions Panel)
// ==================================================
'use strict';

var TeamList = require('../../static/teams.js');


// TODO On Team Select Change (global) RESET/CLEAR Trade Data [??? Shuck aboudiit...???]
//      ...like probably if the active team has players in the trade queue... then maybe reset.

var Trades = React.createClass({
    getDefaultProps: function() {
      return {
        teams       : TeamList,
        messages    : {
          heading   : 'Execute a blockbuster trade for your team:'
        }
      };
    },
    handleTradePlayers: function() {

      console.log('execute trade');

    },
    handleChangeTradeTeam: function(e) {
      var team_id = e.target.value;
      this.props.handleChangeTradeTeam(team_id);
      document.getElementById('trade-players-select').selectedIndex = 0;
    },
    addActiveTeamPlayer: function() {

      console.log('add active team player');

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

      // activeTrade : {
      //   status    : false,
      //   active    : { id : '', players : [], id_list : [] },
      //   passive   : { id : '', players : [], id_list : [] }
      // }

      // TODO Inline... this.props.activeTrade

      // if (this.state.leagueTeam.players.length === 0) {
      //   team_select.disabled = false;
      //   team_select.className = '';
      // }
    },
    removeActiveTeamPlayer: function(e) {

      console.log('remove active player');
    },
    render: function() {
      var activeTeam     = this.props.activeTeam,
          haveActive     = this.props.activeTrade.active.players[0] ? true : false,
          havePassive    = this.props.activeTrade.passive.players[0] ? true : false;
      var activePlayers  = this.props.activeTrade.active.players.map(function(player) {
            return (
              <li key={player.id}>
                {player.firstname.charAt(0)}. {player.lastname}
                <a className="remove-button" data-id={player.id} onClick={this.removeActiveTeamPlayer}>
                  <i className="fa fa-remove"></i>
                </a>
              </li>
            );
          }.bind(this));
      var passivePlayers = this.props.activeTrade.passive.players.map(function(player) {
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
              <div className="cover"
                onDragEnter={this.props.handleTradeDragLeave}
                onDragLeave={this.props.handleTradeDragEnter}>
              </div>
            </div>
            <select id="trade-team-select" defaultValue="0" onChange={this.handleChangeTradeTeam}>
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
              <ul id="trade-player-user-list" className={ haveActive ? 'active' : null }>
            { haveActive
              ? {activePlayers}
              : <li className="trade-team-placeholder">{activeTeam}</li> }
              </ul>
              <div className="trade-marker">
                <i className="fa fa-refresh"></i>
              </div>
              <ul id="trade-player-league-list" className={ havePassive ? 'active' : null }>
            { havePassive
              ? {passivePlayers}
              : <li className="trade-team-placeholder">{ this.props.activeTrade.passive.id ? this.props.activeTrade.passive.id : '- - -' }</li> }
              </ul>
            </div>
            <button id="trade-player-button" onClick={this.handleTradePlayers}>Execute Trade</button>
            <div id="trade-player-confirm" className="transaction-confirm">
              Traded Executed <i className="fa fa-magic"></i>
            </div>
          </div>
        </div>
      );
    }
});

module.exports = Trades;
