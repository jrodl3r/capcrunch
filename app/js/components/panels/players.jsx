// CapCrunch Player List Panel (Roster Menu)
// ==================================================
'use strict';

var PlayersPanel = React.createClass({
    blockDrag: function(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    render: function() {
      var haveData    = this.props.playerData[0].firstname ? true : false,
          playerType  = this.props.playerType,
          isSkater    = playerType === 'Goalies' || playerType === 'Inactive' ? true : false,
          playerItems = this.props.playerData.map(function(player, i) {
            return (
              <li className="row">
                <div className="item"
                  draggable={true}
                  onMouseDown={this.props.handleMouseDown}
                  onMouseUp={this.props.handleMouseUp}
                  onDragStart={this.props.handleDragStart}
                  onDragEnd={this.props.handleDragEnd}
                  data-firstname={player.firstname}
                  data-lastname={player.lastname}
                  data-contract={player.contract[0]}
                  data-jersey={player.jersey}
                  data-image={player.image}
                  data-shot={player.shot}>
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

      return (
        <div id={this.props.panelId} className={ playerType === 'Goalies' ? 'panel short player-list' : 'panel player-list' }>
          <div className="title">{playerType}</div>
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
            <ul>{playerItems}</ul>
          </div>
        : <div className="inner">
            <div className="team-select-reminder">Select Team<span className="arrow">&#10548;</span></div>
          </div> }
        </div>
      );
    }
  });

module.exports = PlayersPanel;
