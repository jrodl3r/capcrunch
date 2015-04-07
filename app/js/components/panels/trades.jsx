// CapCrunch Trade Player Tab (Transactions Panel)
// ==================================================
'use strict';

var TeamList = require('../../static/teams.js');

var Trades = React.createClass({
    getDefaultProps: function() {
      return {
        tradeData   : [{ id : '', players : [] }, { id : '', players : [] }],
        teams       : TeamList,
        messages    : {
          heading   : 'Execute a blockbuster trade for your team:'
        }
      };
    },
    componentDidMount: function() {
      this.props.tradeData[0].id = this.props.activeTeam;
    },
    handleTradePlayers: function() {
      var tradeData = this.props.tradeData;
      this.props.handleTradePlayers(tradeData);
    },
    handleChangeTradeTeam: function(e) {
      var team_id = e.target.value;
      this.props.handleChangeTradeTeam(team_id);
      this.props.tradeData[1].id = team_id;
      document.getElementById('trade-players-select').selectedIndex = 0;
    },
    handleAddSelectPlayer: function(e) {
      var player = document.getElementById('trade-players-select').value;
      e.preventDefault();
      if (this.props.tradeData[1].players.indexOf(player) === -1) {
        this.props.tradeData[1].players.push(player);
      }
    },
    render: function() {
      return (
        <div id="trades" className="tab-area active">
          <div className="inner">
            <p id="tradeplayer-msg">{this.props.messages.heading}</p>
            <div id="trade-drop-area">Drop Players</div>
            <select id="trade-team-select" onChange={this.handleChangeTradeTeam}>
              <option selected disabled>Team</option>
              {this.props.teams.map(function(team) {
                return <option key={team.id} value={team.id}>{team.id}</option>;
              })}
            </select>
            <select id="trade-players-select">
              <option selected disabled>Players</option>
              { this.props.playerData.forwards.length ? <option disabled>─ Forwards ────────</option> : null }
              {this.props.playerData.forwards.map(function(player, i) {
                return (
                  <option key={player.id} value={player.id}>
                    {player.firstname} {player.lastname}
                  </option>
                );
              })}
              { this.props.playerData.defensemen.length ? <option disabled>─ Defense ────────</option> : null }
              {this.props.playerData.defensemen.map(function(player, i) {
                return (
                  <option key={player.id} value={player.id}>
                    {player.firstname} {player.lastname}
                  </option>
                );
              })}
              { this.props.playerData.goaltenders.length ? <option disabled>─ Goalies ────────</option> : null }
              {this.props.playerData.goaltenders.map(function(player, i) {
                return (
                  <option key={player.id} value={player.id}>
                    {player.firstname} {player.lastname}
                  </option>
                );
              })}
              { this.props.playerData.inactive.length ? <option disabled>─ Inactive ────────</option> : null }
              {this.props.playerData.inactive.map(function(player, i) {
                return (
                  <option key={player.id} value={player.id}>
                    {player.firstname} {player.lastname}
                  </option>
                );
              })}
            </select>
            <a id="trade-player-add-player" className="add-button" title="Add Player" onClick={this.handleAddSelectPlayer}>
              <i className="fa fa-plus"></i>
            </a>
            <div id="trade-player-breakdown">
              <ul id="trade-player-home-list">
                <li className="trade-team-placeholder">{this.props.activeTeam}</li>
                <!-- <li className="trade-player-item">S. Bobrovski <a className="remove-button"><i className="fa fa-remove"></i></a></li> -->
              </ul>
              <div className="trade-marker">
                <i className="fa fa-refresh"></i>
              </div>
              <ul id="trade-player-away-list">
                <li className="trade-team-placeholder">{ this.props.tradeData[1].id ? this.props.tradeData[1].id : '- - -' }</li>
                <!-- <li className="trade-player-item">R. Hextall<a className="remove-button"><i className="fa fa-remove"></i></a></li> -->
                <!-- <li className="trade-player-item">E. Lindros<a className="remove-button"><i className="fa fa-remove"></i></a></li> -->
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
