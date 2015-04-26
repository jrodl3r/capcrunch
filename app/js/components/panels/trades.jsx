// CapCrunch Trade Player Tab (Transactions Panel)
// ==================================================
'use strict';

var TeamList = require('../../static/teams.js');

var Trades = React.createClass({
    getDefaultProps: function() {
      return {
        teams             : TeamList,
        messages          : {
          heading         : 'Execute a blockbuster trade for your team:',
          missing_players : 'Both teams need at least one player...',
          max_players     : 'Five players per team trade maximum...'
        }
      };
    },
    handleTradeExecution: function() {
      var activeTrade   = this.props.activeTrade,
          team_select   = document.getElementById('trade-team-select'),
          player_item   = document.getElementById('trade-players-select'),
          trade_msg     = document.getElementById('trade-player-msg'),
          trade_confirm = document.getElementById('trade-player-confirm');
      if (activeTrade.active.id_list.length && activeTrade.passive.id_list.length) {
        this.props.handleTradeExecution();
        trade_confirm.className = 'transaction-confirm active';
        team_select.selectedIndex = 0;
      } else {
        trade_msg.innerText = this.props.messages.missing_players;
        trade_msg.className = 'warning';
        if (team_select.value === '0' && !activeTrade.passive.id_list.length) {
          team_select.className = 'missing';
          team_select.focus();
        } else if (player_item.value === '0' && !activeTrade.passive.id_list.length) {
          player_item.className = 'missing';
          player_item.focus();
        }
        setTimeout(function() {
          if (trade_msg.innerText === this.props.messages.missing_players) {
            trade_msg.innerText = this.props.messages.heading;
            trade_msg.className = '';
          }
        }.bind(this), 2500);
      }
    },
    handleChangeTradeTeam: function(e) {
      var team_id       = e.target.value,
          team_select   = document.getElementById('trade-team-select'),
          player_select = document.getElementById('trade-players-select'),
          trade_msg     = document.getElementById('trade-player-msg');
      this.props.handleChangeTradeTeam(team_id);
      team_select.className = '';
      player_select.selectedIndex = 0;
      trade_msg.innerText = this.props.messages.heading;
      trade_msg.className = '';
    },
    handleChangeSelectedPlayer: function(e) {
      var trade_msg = document.getElementById('trade-player-msg'),
          add_button = document.getElementById('trade-player-add-player');
      e.target.className = '';
      trade_msg.innerText = this.props.messages.heading;
      trade_msg.className = '';
      add_button.className = 'add-button active';
    },
    addPassiveTeamPlayer: function(e) {
      e.preventDefault();
      var team_select = document.getElementById('trade-team-select'),
          player_item = document.getElementById('trade-players-select'),
          trade_msg   = document.getElementById('trade-player-msg'),
          add_button  = document.getElementById('trade-player-add-player');
      if (this.props.activeTrade.passive.id_list.length === 5) {
        trade_msg.innerText = this.props.messages.max_players;
        trade_msg.className = 'warning';
        setTimeout(function() {
          if (trade_msg.innerText === this.props.messages.max_players) {
            trade_msg.innerText = this.props.messages.heading;
            trade_msg.className = '';
          }
        }.bind(this), 2500);
      } else if (player_item.value !== '0') {
        var player_id    = player_item.value,
            player_group = player_item.options[player_item.selectedIndex].getAttribute('data-group'),
            playerData   = this.props.playerData;
        var player = playerData[player_group].filter(function(player_obj) {
          return player_obj.id === player_id;
        })[0];
        player.type = player_group;
        this.props.handleAddTradePlayer('passive', player);
        player_item.options[player_item.selectedIndex].disabled = true;
        player_item.options[0].selected = true;
        trade_msg.innerText = this.props.messages.heading;
        trade_msg.className = '';
        add_button.className = 'add-button';
      } else {
        if (team_select.value === '0') {
          team_select.className = 'missing';
          team_select.focus();
        } else {
          player_item.className = 'missing';
          player_item.focus();
        }
        trade_msg.innerText = this.props.messages.missing_players;
        trade_msg.className = 'warning';
      }
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
    buildPlayerGroup: function(players, type) {
      var player_list;
      player_list = players.map(function(player) {
        return (
          <li key={player.id} id={player.id + 'item'}>
            <span>{player.firstname.charAt(0)}. </span><span className="lastname">{player.lastname}</span>
            <a className="remove-button" data-id={player.id}
              onClick={ type === 'active' ? this.removeActiveTeamPlayer : this.removePassiveTeamPlayer }>
              <i className="fa fa-remove"></i>
            </a>
          </li>
        );
      }.bind(this));
      return player_list;
    },
    buildTeamList: function(players, player_type, passive_team, active_team) {
      var player_list, active_players = this.props.activePlayers;
      player_list = players.map(function(player, i) {
        if (player.team === active_team && player.actions && player.actions.indexOf('acquired') !== -1) {
          return (
            <option key={player.id} value={player.id} data-group={player_type} disabled>
              &raquo; {player.firstname} {player.lastname}
            </option>
          );
        } else if (player.team === passive_team && player.actions &&
                   player.actions.indexOf('traded') !== -1 || active_players.indexOf(player.id) !== -1) {
          return (
            <option key={player.id} value={player.id} data-group={player_type} disabled>
              &laquo; {player.firstname} {player.lastname}
            </option>
          );
        } else {
          return (
            <option key={player.id} value={player.id} data-group={player_type}>
              {player.firstname} {player.lastname}
            </option>
          );
        }
      });
      return player_list;
    },
    addButtonMouseOver: function(e) {
      var player_item = document.getElementById('trade-players-select');
      if (player_item.value !== '0') {
        e.currentTarget.className = 'add-button active hover';
      }
    },
    addButtonMouseLeave: function(e) {
      var player_item = document.getElementById('trade-players-select');
      if (player_item.value !== '0') {
        e.currentTarget.className = 'add-button active';
      } else {
        e.currentTarget.className = 'add-button';
      }
    },
    onPlayerDropDragOver: function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    },

    render: function() {
      var activeTeam      = this.props.activeTrade.active.team ? this.props.activeTrade.active.team : this.props.activeTeam,
          passiveTeam     = this.props.activeTrade.passive.team,
          forwardsList    = this.buildTeamList(this.props.playerData.forwards, 'forwards', passiveTeam, this.props.activeTeam),
          defenseList     = this.buildTeamList(this.props.playerData.defensemen, 'defensemen', passiveTeam, this.props.activeTeam),
          goaliesList     = this.buildTeamList(this.props.playerData.goaltenders, 'goaltenders', passiveTeam, this.props.activeTeam),
          inactiveList    = this.buildTeamList(this.props.playerData.inactive, 'inactive', passiveTeam, this.props.activeTeam),
          activeIdList    = this.props.activeTrade.active.id_list,
          passiveIdList   = this.props.activeTrade.passive.id_list,
          activePlayers   = this.buildPlayerGroup(this.props.activeTrade.active.players, 'active'),
          passivePlayers  = this.buildPlayerGroup(this.props.activeTrade.passive.players, 'passive'),
          haveActive      = activeIdList.length ? true : false,
          havePassive     = passiveIdList.length ? true : false,
          playerTradeSize = '',
          threePlayerDeal = activeIdList.length === 3 || passiveIdList.length === 3 ? true : false,
          fourPlayerDeal  = activeIdList.length === 4 || passiveIdList.length === 4 ? true : false,
          fivePlayerDeal  = activeIdList.length === 5 || passiveIdList.length === 5 ? true : false;
      if (threePlayerDeal) { playerTradeSize = ' three-player-trade'; }
      if (fourPlayerDeal)  { playerTradeSize = ' four-player-trade'; }
      if (fivePlayerDeal)  { playerTradeSize = ' five-player-trade'; }

      return (
        <div id="trades" className={'tab-area active' + playerTradeSize}>
          <div className="inner">
            <p id="trade-player-msg">{this.props.messages.heading}</p>
            <div id="trade-drop-area" onDragOver={this.onPlayerDropDragOver}>
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
            <select id="trade-players-select" defaultValue="0"
              onChange={this.handleChangeSelectedPlayer}>
              <option value="0" disabled>Players</option>
              { this.props.playerData.forwards.length ? <option disabled>─ Forwards ────────</option> : null }
              {forwardsList}
              { this.props.playerData.defensemen.length ? <option disabled>─ Defense ────────</option> : null }
              {defenseList}
              { this.props.playerData.goaltenders.length ? <option disabled>─ Goalies ────────</option> : null }
              {goaliesList}
              { this.props.playerData.inactive.length ? <option disabled>─ Inactive ────────</option> : null }
              {inactiveList}
            </select>
            <a id="trade-player-add-player" className="add-button"
              onMouseOver={this.addButtonMouseOver}
              onMouseLeave={this.addButtonMouseLeave}
              onClick={this.addPassiveTeamPlayer}>
              <i className="fa fa-plus"></i>
            </a>
            <div id="trade-player-breakdown">
          { haveActive
            ? <ul id="trade-player-active-list" className="active">{activePlayers}</ul>
            : <ul className="trade-player-list-placeholder"><li>{activeTeam}</li></ul> }
              <div className={ haveActive && havePassive ? 'trade-marker active' : 'trade-marker' }>
                <i className="fa fa-refresh"></i>
              </div>
          { havePassive
            ? <ul id="trade-player-passive-list" className="active">{passivePlayers}</ul>
            : <ul className="trade-player-list-placeholder"><li>{ passiveTeam ? passiveTeam : '- - -' }</li></ul> }
            </div>
            <button id="trade-player-button" onClick={this.handleTradeExecution}>Execute Trade</button>
            <div id="trade-player-confirm" className="transaction-confirm">
              Traded Executed <i className="fa fa-magic"></i>
            </div>
          </div>
        </div>
      );
    }
});

module.exports = Trades;
