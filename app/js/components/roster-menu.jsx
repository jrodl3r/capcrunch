// Roster Menu
// ==================================================
'use strict';

var SharePanel   = require('./panels/share.jsx'),
    PlayersPanel = require('./panels/players.jsx'),
    ActionsPanel = require('./panels/actions.jsx');

var RosterMenu = React.createClass({
    render: function() {
      return (
        <div id="menu" className={ this.props.activeView === 'roster' ? 'section active' : 'section' }>
          <SharePanel
            rosterInfo={this.props.rosterInfo}
            teamName={this.props.teamData.name}
            handleRosterSubmit={this.props.onRosterSubmit} />
          <PlayersPanel playerType="forwards" panelTitle="Forwards" panelId="forwards-list"
            playerData={this.props.teamData.players.forwards}
            activePlayers={this.props.activePlayers}
            activeTrade={this.props.activeTrade}
            handleMouseOver={this.props.onMouseOver}
            handleMouseLeave={this.props.onMouseLeave}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd}
            handleDragEnter={this.props.onDragEnter}
            handleRemoveDragEnter={this.props.onRemoveDragEnter}
            handleRemoveDragLeave={this.props.onRemoveDragLeave} />
          <PlayersPanel playerType="defensemen" panelTitle="Defense" panelId="defense-list"
            playerData={this.props.teamData.players.defensemen}
            activePlayers={this.props.activePlayers}
            activeTrade={this.props.activeTrade}
            handleMouseOver={this.props.onMouseOver}
            handleMouseLeave={this.props.onMouseLeave}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd}
            handleDragEnter={this.props.onDragEnter}
            handleRemoveDragEnter={this.props.onRemoveDragEnter}
            handleRemoveDragLeave={this.props.onRemoveDragLeave} />
          <PlayersPanel playerType="goaltenders" panelTitle="Goalies" panelId="goalies-list"
            playerData={this.props.teamData.players.goaltenders}
            activePlayers={this.props.activePlayers}
            activeTrade={this.props.activeTrade}
            handleMouseOver={this.props.onMouseOver}
            handleMouseLeave={this.props.onMouseLeave}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd}
            handleDragEnter={this.props.onDragEnter}
            handleRemoveDragEnter={this.props.onRemoveDragEnter}
            handleRemoveDragLeave={this.props.onRemoveDragLeave} />
          <PlayersPanel playerType="inactive" panelTitle="Inactive" panelId="inactive-list"
            createdData={this.props.teamData.players.created}
            playerData={this.props.teamData.players.inactive}
            activePlayers={this.props.activePlayers}
            activeTrade={this.props.activeTrade}
            handleMouseOver={this.props.onMouseOver}
            handleMouseLeave={this.props.onMouseLeave}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd}
            handleDragEnter={this.props.onDragEnter}
            handleRemoveDragEnter={this.props.onRemoveDragEnter}
            handleRemoveDragLeave={this.props.onRemoveDragLeave} />
          <ActionsPanel
            playerData={this.props.playerData}
            activeTeam={this.props.activeTeam}
            activeTrade={this.props.activeTrade}
            activePlayers={this.props.activePlayers}
            handleCreatePlayer={this.props.onCreatePlayer}
            handleTradeExecution={this.props.onTradeExecution}
            handleChangeTradeTeam={this.props.onChangeTradeTeam}
            handleAddTradePlayer={this.props.onAddTradePlayer}
            handleRemoveTradePlayer={this.props.onRemoveTradePlayer}
            handleTradeDragEnter={this.props.onTradeDragEnter}
            handleTradeDragLeave={this.props.onTradeDragLeave} />
        </div>
      );
    }
  });

module.exports = RosterMenu;
