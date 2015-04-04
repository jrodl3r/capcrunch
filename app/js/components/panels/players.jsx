// CapCrunch Player List Panel (Roster Menu)
// ==================================================
'use strict';

var PlayersPanel = React.createClass({
    blockDrag: function(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    render: function() {
      var haveData       = this.props.playerData[0] ? true : false,
          playerType     = this.props.playerType,
          isActive       = playerType !== 'inactive' ? true : false,
          isSkater       = playerType !== 'goaltenders' || playerType !== 'inactive' ? false : true,
          haveCreated    = this.props.teamData && this.props.teamData.players.created ? true : false,
          playerItems    = this.props.playerData.map(function(player, i) {
            return (
              <li className={ this.props.activePlayers.indexOf(player.id) !== -1 ? 'row removed' : 'row'}>
                <div className="item"
                  draggable={true}
                  onMouseDown={this.props.handleMouseDown}
                  onMouseUp={this.props.handleMouseUp}
                  onDragStart={this.props.handleDragStart}
                  onDragEnd={this.props.handleDragEnd}
                  data-type={playerType}
                  data-index={i}>
                  <div className="name" onMouseDown={this.blockDrag}>
                    <span className="jersey" onMouseDown={this.blockDrag}>{player.jersey}</span>
                    {player.lastname}, {player.firstname}
                  </div>
              { isSkater
                ? <div className="shot" onMouseDown={this.blockDrag}>&nbsp;</div>
                : <div className="shot" onMouseDown={this.blockDrag}>{ player.shot || <span>&nbsp;</span> }</div> }
                  <div className="salary" onMouseDown={this.blockDrag}>{ player.contract[0] === '0.000' ? '-' : player.contract[0] }</div>
                  <div className="handle">&nbsp;</div>
                </div>
              </li>
            );
          }.bind(this));
          if (haveCreated) {
            var createdPlayers = this.props.teamData.players.created.map(function(player, i) {
              return (
                <li className={ this.props.activePlayers.indexOf(player.id) !== -1 ? 'row removed' : 'row'}>
                  <div className="item"
                    draggable={true}
                    onMouseDown={this.props.handleMouseDown}
                    onMouseUp={this.props.handleMouseUp}
                    onDragStart={this.props.handleDragStart}
                    onDragEnd={this.props.handleDragEnd}
                    data-type="created"
                    data-index={i}>
                    <div className="name" onMouseDown={this.blockDrag}>
                      <span className="jersey" onMouseDown={this.blockDrag}>{player.jersey}</span>
                      {player.lastname}, {player.firstname}
                    </div>
                    <div className="shot" onMouseDown={this.blockDrag}>&nbsp;</div>
                    <div className="salary" onMouseDown={this.blockDrag}>{ player.contract[0] === '0.000' ? '-' : player.contract[0] }</div>
                    <div className="handle">&nbsp;</div>
                  </div>
                </li>
              );
            }.bind(this));
          }

      return (
        <div id={this.props.panelId} className={ playerType === 'goaltenders' ? 'panel short player-list' : 'panel player-list' }>
          <div className="title">{this.props.panelTitle}</div>
      { haveData
        ? <div className="inner">
            <div className="header">
              <div className="name">Player</div>
          { isSkater
            ? <div className="shot">&nbsp;</div>
            : <div className="shot">Shot</div> }
              <div className="salary">Salary</div>
              <div className="handle">&nbsp;</div>
            </div>
            <ul>
              { haveCreated ? {createdPlayers} : null }
              {playerItems}
            </ul>
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
        </div>
      );
    }
  });

module.exports = PlayersPanel;
