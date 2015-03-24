// CapCrunch Player List Panel (Roster Menu)
// ==================================================
'use strict';

var PlayersPanel = React.createClass({

    render: function() {
      var haveData    = this.props.playerData[0].firstname ? true : false,
          playerType  = this.props.playerType,
          isSkater    = playerType === 'Goalies' || playerType === 'Inactive' ? true : false,
          playerItems = this.props.playerData.map(function(player) {
            return (
              <li className="row">
                <div className="name">
                  <span className="jersey">{player.jersey}</span>
                  {player.lastname}, {player.firstname}
                </div>
            { isSkater
              ? <div className="shot">&nbsp;</div>
              : <div className="shot">{ player.shot || <span>&nbsp;</span> }</div> }
                <div className="salary">{ player.contract[0] === '0.000' ? '-' : player.contract[0] }</div>
              </li>
            );
          });

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
            </div>
            <ul>{playerItems}</ul>
          </div>
        : <div className="inner">
            <div className="empty">Select Team<span className="arrow">&#10548;</span></div>
          </div> }
        </div>
      );
    }
  });

module.exports = PlayersPanel;
