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
          <PlayersPanel playerType="Forwards" panelId="forwards-list"
            playerData={this.props.teamData.players.forwards}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd} />
          <PlayersPanel playerType="Defense" panelId="defense-list"
            playerData={this.props.teamData.players.defensemen}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd} />
          <PlayersPanel playerType="Goalies" panelId="goalies-list"
            playerData={this.props.teamData.players.goaltenders}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd} />
          <PlayersPanel playerType="Inactive" panelId="inactive-list"
            playerData={this.props.teamData.players.inactive}
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
