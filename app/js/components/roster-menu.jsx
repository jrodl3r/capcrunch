// CapCrunch Roster Menu (Component)
// ==================================================
'use strict';

var SharePanel   = require('./panels/share.jsx'),
    PlayersPanel = require('./panels/players.jsx'),
    TradePanel   = require('./panels/trade.jsx'),
    CreatePanel  = require('./panels/create.jsx');

var RosterMenu = React.createClass({
    render: function() {
      return (
        <div id="menu" className="section active">
          <SharePanel teamName={this.props.teamData.name} />
          <PlayersPanel playerType="forwards" panelTitle="Forwards" panelId="forwards-list"
            playerData={this.props.teamData.players.forwards}
            activePlayers={this.props.activePlayers}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd} />
          <PlayersPanel playerType="defensemen" panelTitle="Defense" panelId="defense-list"
            playerData={this.props.teamData.players.defensemen}
            activePlayers={this.props.activePlayers}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd} />
          <PlayersPanel playerType="goaltenders" panelTitle="Goalies" panelId="goalies-list"
            playerData={this.props.teamData.players.goaltenders}
            activePlayers={this.props.activePlayers}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd} />
          <PlayersPanel playerType="inactive" panelTitle="Inactive" panelId="inactive-list"
            playerData={this.props.teamData.players.inactive}
            activePlayers={this.props.activePlayers}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd} />
          <TradePanel />
          <CreatePanel />
        </div>
      );
    }
  });

module.exports = RosterMenu;
