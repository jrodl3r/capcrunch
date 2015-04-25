// CapCrunch Player List Panel (Roster Menu)
// ==================================================
'use strict';

var PlayersPanel = React.createClass({
    buildPlayerList: function(players, player_type) {
      var player_list, status, first_active = 0, first_inactive_marked = false;
      player_list = players.map(function(player, i) {
        status = '';
        if (this.props.activePlayers.indexOf(player.id) !== -1 ||
            this.props.activeTrade.active.id_list.indexOf(player.id) !== -1 ||
            this.props.activeTrade.passive.id_list.indexOf(player.id) !== -1) {
          status = ' inplay';
          if (first_active === i) {
            first_active = first_active + 1;
          }
        } else if (first_active && player_type !== 'inactive') {
          status = ' first-active';
          first_active = 0;
        } else if (player_type === 'inactive') {
          if (first_active && !this.props.playerData.created.length) {
            status = ' first-active';
            first_active = 0;
          } else if (this.props.playerData.created.length && !first_inactive_marked) {
            for (var j = 0; j < this.props.playerData.created.length; j++) {
              if (this.props.activePlayers.indexOf(this.props.playerData.created[j].id) === -1) {
                break;
              } else if (j === this.props.playerData.created.length - 1) {
                status = ' first-active';
                first_inactive_marked = true;
                first_active = 0;
              }
            }
          }
        }
        if (player.actions && player.actions.length) {
          status = ' ' + player.actions.join(' ') + status;
        }

        return (
          <li key={i + player.id} className={'row' + status}>
            <div className="item"
              draggable={ player.actions && player.actions.indexOf('traded') !== -1 ? false : true }
              onMouseDown={this.props.handleMouseDown}
              onMouseUp={this.props.handleMouseUp}
              onMouseOver={this.itemMouseOver}
              onMouseLeave={this.itemMouseLeave}
              onDragStart={this.props.handleDragStart}
              onDragEnd={this.props.handleDragEnd}
              data-type={player_type}
              data-index={i}>
              <div className="jersey">{player.jersey}</div>
          { player.firstname
            ? <div className="name">{player.lastname}, {player.firstname}</div>
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
            { player.actions && player.actions.indexOf('created') !== -1
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
    itemMouseOver: function(e) {
      e.currentTarget.className = e.currentTarget.className + ' hover';
    },
    itemMouseLeave: function(e) {
      e.currentTarget.className = e.currentTarget.className.replace(' hover', '');
    },
    onDragOver: function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    },

    render: function() {
      var playerType      = this.props.playerType,
          isActive        = playerType !== 'inactive' ? true : false,
          isSkater        = playerType !== 'goaltenders' && playerType !== 'inactive' ? true : false,
          rosterPlayers   = this.props.playerData[playerType].length ? this.props.playerData[playerType] : [],
          createdPlayers  = !isActive && this.props.playerData.created.length ? this.props.playerData.created : [],
          playerItems     = this.buildPlayerList(rosterPlayers, playerType),
          createdItems    = this.buildPlayerList(createdPlayers, 'created');

      return (
        <div id={this.props.panelId} className={ playerType === 'goaltenders' ? 'panel short player-list' : 'panel player-list' }>
          <div className="title">
            {this.props.panelTitle}
            <a className="panel-toggle-button">
              <i className="fa fa-chevron-up"></i>
            </a>
          </div>
      { playerItems.length
        ? <div className="inner" onDragOver={this.onDragOver}>
          { isActive
            ? <ul>{playerItems}</ul>
            : <ul>
                {createdItems}
                {playerItems}
              </ul> }
          </div>
        : <div className="inner">
            <div className="team-select-reminder"></div>
          </div> }
          <div className="bench-player" onDragOver={this.onDragOver}>
            <i className="fa fa-rotate-left"></i> Bench / Remove
            <div className="cover"
              onDragEnter={this.props.handleBenchDragEnter}
              onDragLeave={this.props.handleBenchDragLeave}>
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
