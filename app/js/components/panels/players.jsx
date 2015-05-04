// Player Panel
// ==================================================
'use strict';

var UI = require('../../ui.js');

var PlayersPanel = React.createClass({
    buildPlayerList: function(players, player_type) {
      var player_list, status;
      player_list = players.map(function(player, i) {
        status = '';
        if (this.props.activePlayers.indexOf(player.id) !== -1 ||
            this.props.activeTrade.active.id_list.indexOf(player.id) !== -1) {
          status = 'inplay ';
        }
        if (player.actions && player.actions.length) {
          status = player.actions.join(' ') + ' ' + status;
        }

        return (
          <li key={i + player.id} className={ status ? status + 'row' : 'row' }>
            <div className="item"
              draggable={ player.actions && player.actions.indexOf('traded') !== -1 ? false : true }
              onMouseDown={this.props.handleMouseDown}
              onMouseUp={this.props.handleMouseUp}
              onMouseOver={this.props.handleMouseOver}
              onMouseLeave={this.props.handleMouseLeave}
              onDragStart={this.props.handleDragStart}
              onDragEnd={this.props.handleDragEnd}
              data-type={player_type}
              data-index={i}>
              <div className="jersey">{player.jersey}</div>
          { player.firstname
            ? <div className="name">
                {player.lastname}, {player.firstname}
              </div>
            : <div className="name">{player.lastname}</div> }
              <div className="info">
            { player_type === 'goaltenders' || !player.shot
              ? <span className="shot"></span>
              : <span className="shot">{player.shot}</span> }
            { player_type === 'goaltenders' || player_type === 'defensemen' || !player.position
              ? <span className="position"></span>
              : <span className="position">{ player.shot ? '/' + player.position : player.position}</span> }
              </div>
              <div className="handle"></div>
              <div className="salary">{ player.contract[0] === '0.000' ? '-' : player.contract[0] }</div>
              <div className="status">
            { player.actions && player.actions.indexOf('traded') !== -1
              ? <div className="traded">T</div>
              : null }
            { player.actions && player.actions.indexOf('acquired') !== -1
              ? <div className="acquired">A</div>
              : null }
            { player_type === 'created'
              ? <div className="created">C</div>
              : null }
              </div>
              <div className="cover"></div>
            </div>
          </li>
        );
      }.bind(this));
      return player_list;
    },
    togglePanelView: function(e) {
      var button = e.currentTarget,
          id     = button.dataset.panel,
          panel  = document.getElementById(id);
      e.preventDefault();
      if (button.className === 'active') {
        panel.className = panel.className.replace(' collapsed', '');
        button.className = button.className.replace('active', '');
      } else {
        panel.className = panel.className + ' collapsed';
        button.className = button.className + 'active';
      }
    },
    onDragOver: function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    },

    render: function() {
      var playerType     = this.props.playerType,
          havePlayers    = this.props.playerData.length,
          rosterPlayers  = havePlayers ? this.buildPlayerList(this.props.playerData, playerType) : null,
          haveCreated    = playerType === 'inactive' ? this.props.createdData.length : null,
          createdPlayers = haveCreated ? this.buildPlayerList(this.props.createdData, 'created') : null;

      return (
        <div id={this.props.panelId} className={ playerType === 'goaltenders' ? 'panel short player-list' : 'panel player-list' }>
          <div className="title">
            {this.props.panelTitle}
            <a className="" data-panel={this.props.panelId} onClick={this.togglePanelView}>
              <i className="fa fa-chevron-up"></i>
            </a>
          </div>
      { havePlayers
        ? <div className="inner" onDragEnter={this.props.handleDragEnter}>
          { !haveCreated
            ? <ul>{rosterPlayers}</ul>
            : <ul>
                {createdPlayers}
                {rosterPlayers}
              </ul> }
          </div>
        : <div className="inner">
            <div className="team-select-reminder"></div>
          </div> }
          <div className="remove-player" onDragOver={this.onDragOver}>
            <i className="fa fa-rotate-left"></i> Remove Player
            <div className="cover"
              onDragEnter={this.props.handleRemoveDragEnter}
              onDragLeave={this.props.handleRemoveDragLeave}>
            </div>
          </div>
          <div className="loading-list">
            <i className="fa fa-cog fa-spin"></i> Loading
          </div>
        </div>
      );
    }
  });

module.exports = PlayersPanel;
