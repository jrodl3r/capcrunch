// CapCrunch Trade Player Tab (Transactions Panel)
// ==================================================
'use strict';

var TeamList = require('../../static/teams.js');


// TODO On Team Select Change (global) RESET/CLEAR Trade Data [??? Shuck aboudiit...???]
//      ...like probably if the active team has players in the trade queue... then maybe reset.

var Trades = React.createClass({
    getInitialState: function() {
      return {
        userTeam   : { id : '', players : [], id_list : [] },
        leagueTeam : { id : '', players : [], id_list : [] }
      };
    },
    getDefaultProps: function() {
      return {
        teams       : TeamList,
        messages    : {
          heading   : 'Execute a blockbuster trade for your team:'
        }
      };
    },
    handleTradePlayers: function() {

      // TODO assemble tradeData...

      //var tradeData = this.state.tradeData;
      //this.props.handleTradePlayers(tradeData);
      console.log('execute trade');
    },
    handleChangeTradeTeam: function(e) {
      var team_id = e.target.value;
      this.props.handleChangeTradeTeam(team_id);
      var updateLeagueTeamId = React.addons.update(this.state, {
        leagueTeam : { id : { $set: team_id }}
      });
      this.setState(updateLeagueTeamId);
      document.getElementById('trade-players-select').selectedIndex = 0;
    },
    addUserTeamPlayer: function() {

      console.log('add user team player');

    },
    removeUserTeamPlayer: function() {

      console.log('remove user team player');

    },
    addLeagueTeamPlayer: function(e) {
      var team_select  = document.getElementById('trade-team-select'),
          player_item  = document.getElementById('trade-players-select'),
          player_id    = player_item.value,
          player_group = player_item.options[player_item.selectedIndex].getAttribute('data-group'),
          playerData   = this.props.playerData;
      e.preventDefault();
      var player = playerData[player_group].filter(function(player_obj) {
        return player_obj.id === player_id;
      })[0];
      var updateLeagueTeam = React.addons.update(this.state, {
        leagueTeam : { players : { $push: [player] },
                       id_list : { $push: [player_id] }}
      });
      this.setState(updateLeagueTeam);
      player_item.options[player_item.selectedIndex].disabled = true;
      player_item.options[0].selected = true;
      team_select.disabled = true;
      team_select.className = 'disabled';
    },
    removeLeagueTeamPlayer: function(e) {
      var team_select  = document.getElementById('trade-team-select'),
          player_item  = document.getElementById('trade-players-select'),
          player_id    = e.currentTarget.dataset.id,
          player_index = this.state.leagueTeam.id_list.indexOf(player_id);
      e.preventDefault();
      var removeLeaguePlayer = React.addons.update(this.state, {
        leagueTeam : { players : { $splice: [[player_index, 1]] },
                       id_list : { $splice: [[player_index, 1]] }}
      });
      this.setState(removeLeaguePlayer);
      for (var i = 0; i < player_item.options.length; i++) {
        if (player_item.options[i].value === player_id) {
          player_item.options[i].disabled = false;
        }
      }
      if (this.state.leagueTeam.players.length === 0) {
        team_select.disabled = false;
        team_select.className = '';
      }
    },
    render: function() {
      var haveLeaguePlayers = this.state.leagueTeam.players[0] ? true : false,
          activeTeam = this.props.activeTeam,
          leaguePlayers = this.state.leagueTeam.players.map(function(player) {
            return (
              <li key={player.id}>
                {player.firstname.charAt(0)}. {player.lastname}
                <a className="remove-button" onClick={this.removeLeagueTeamPlayer} data-id={player.id}><i className="fa fa-remove"></i></a>
              </li>
            );
          }.bind(this));

      return (
        <div id="trades" className="tab-area active">
          <div className="inner">
            <p id="tradeplayer-msg">{this.props.messages.heading}</p>
            <div id="trade-drop-area">Drop Players</div>
            <select id="trade-team-select" onChange={this.handleChangeTradeTeam}>
              <option selected disabled>Team</option>
              {this.props.teams.map(function(team) {
                if (team.id !== activeTeam) {
                  return <option key={team.id} value={team.id}>{team.id}</option>;
                }
              })}
            </select>
            <select id="trade-players-select">
              <option selected disabled>Players</option>
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
            <a id="trade-player-add-player" className="add-button" title="Add Player" onClick={this.addLeagueTeamPlayer}>
              <i className="fa fa-plus"></i>
            </a>
            <div id="trade-player-breakdown">
              <ul id="trade-player-user-list" className={ this.state.userTeam.players.length ? 'active' : null }>
                <li className="trade-team-placeholder">{activeTeam}</li>
                <!-- <li className="trade-player-item">S. Bobrovski <a className="remove-button"><i className="fa fa-remove"></i></a></li> -->
              </ul>
              <div className="trade-marker">
                <i className="fa fa-refresh"></i>
              </div>
              <ul id="trade-player-league-list" className={ this.state.leagueTeam.players.length ? 'active' : null }>
            { haveLeaguePlayers
              ? {leaguePlayers}
              : <li className="trade-team-placeholder">{ this.state.leagueTeam.id ? this.state.leagueTeam.id : '- - -' }</li> }
              </ul>
            </div>
            <button id="trade-player-button" onClick={this.handleTradePlayers}>
              Execute Trade
            </button>
            <div id="trade-player-confirm" className="transaction-confirm">
              Traded Executed <i className="fa fa-magic"></i>
            </div>
          </div>
        </div>
      );
    }
});

module.exports = Trades;
