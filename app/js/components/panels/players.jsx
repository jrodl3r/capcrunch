// CapCrunch Player List Panel (Roster Menu)
// ==================================================
'use strict';

var PlayersPanel = React.createClass({
    // componentDidUpdate: function() {
    //
    //   //UI.updatePayrollHeight();
    //   console.log('fade back in...');
    //
    // },
    blockDrag: function(e) {
      // e.preventDefault();
      // e.stopPropagation();
    },

    buildPlayerList: function(players, player_type) {
      var player_list, status;
      player_list = players.map(function(player, i) {
        status = '';
        if (this.props.activePlayers.indexOf(player.id) !== -1 ||
            this.props.activeTrade.active.id_list.indexOf(player.id) !== -1 ||
            this.props.activeTrade.passive.id_list.indexOf(player.id) !== -1) {
              status = ' inplay';
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
              onDragStart={this.props.handleDragStart}
              onDragEnd={this.props.handleDragEnd}
              data-type={player_type}
              data-index={i}>
              <div className="name" onMouseDown={this.blockDrag}>
                <span className="jersey" onMouseDown={this.blockDrag}>{player.jersey}</span>
                {player.lastname}, {player.firstname}
              </div>
          { player_type === 'goaltenders' || player_type === 'inactive' || player_type === 'created'
            ? <div className="shot" onMouseDown={this.blockDrag}>&nbsp;</div>
            : <div className="shot" onMouseDown={this.blockDrag}>{ player.shot || <span>&nbsp;</span> }</div> }
              <div className="salary" onMouseDown={this.blockDrag}>{ player.contract[0] === '0.000' ? '-' : player.contract[0] }</div>
              <div className="handle">&nbsp;</div>
            </div>
          </li>
        );
      }.bind(this));
      return player_list;
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
              <i className="fa fa-angle-up"></i>
            </a>
          </div>
      { playerItems.length
        ? <div className="inner">
            <div className="header">
              <div className="name">Player</div>
          { isSkater
            ? <div className="shot">Shot</div>
            : <div className="shot">&nbsp;</div> }
              <div className="salary">Salary</div>
              <div className="handle">&nbsp;</div>
            </div>
          { isActive
            ? <ul>{playerItems}</ul>
            : <ul>
                {createdItems}
                {playerItems}
              </ul> }
          </div>
        : <div className="inner">
            <div className="team-select-reminder">Select Team <i className="fa fa-hand-o-right"></i></div>
          </div> }
          <div className="bench-player">
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
