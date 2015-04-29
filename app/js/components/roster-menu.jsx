// CapCrunch Roster Menu
// ==================================================
'use strict';

var SharePanel        = require('./panels/share.jsx'),
    PlayersPanel      = require('./panels/players.jsx'),
    TransactionsPanel = require('./panels/transactions.jsx');

var RosterMenu = React.createClass({
    render: function() {
      return (
        <div id="menu" className="section active">
          <SharePanel
            teamData={this.props.teamData}
            rosterInfo={this.props.rosterInfo}
            handleRosterSubmit={this.props.onRosterSubmit} />
          <PlayersPanel playerType="forwards" panelTitle="Forwards" panelId="forwards-list"
            playerData={this.props.teamData.players}
            activePlayers={this.props.activePlayers}
            activeTrade={this.props.activeTrade}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd}
            handleDragEnter={this.props.onDragEnter}
            handleRemoveDragEnter={this.props.onRemoveDragEnter}
            handleRemoveDragLeave={this.props.onRemoveDragLeave} />
          <PlayersPanel playerType="defensemen" panelTitle="Defense" panelId="defense-list"
            playerData={this.props.teamData.players}
            activePlayers={this.props.activePlayers}
            activeTrade={this.props.activeTrade}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd}
            handleDragEnter={this.props.onDragEnter}
            handleRemoveDragEnter={this.props.onRemoveDragEnter}
            handleRemoveDragLeave={this.props.onRemoveDragLeave} />
          <PlayersPanel playerType="goaltenders" panelTitle="Goalies" panelId="goalies-list"
            playerData={this.props.teamData.players}
            activePlayers={this.props.activePlayers}
            activeTrade={this.props.activeTrade}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd}
            handleDragEnter={this.props.onDragEnter}
            handleRemoveDragEnter={this.props.onRemoveDragEnter}
            handleRemoveDragLeave={this.props.onRemoveDragLeave} />
          <PlayersPanel playerType="inactive" panelTitle="Inactive" panelId="inactive-list"
            playerData={this.props.teamData.players}
            activePlayers={this.props.activePlayers}
            activeTrade={this.props.activeTrade}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd}
            handleDragEnter={this.props.onDragEnter}
            handleRemoveDragEnter={this.props.onRemoveDragEnter}
            handleRemoveDragLeave={this.props.onRemoveDragLeave} />
          <TransactionsPanel
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
