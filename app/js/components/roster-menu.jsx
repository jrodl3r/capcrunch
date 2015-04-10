// CapCrunch Roster Menu
// ==================================================
'use strict';

var SharePanel        = require('./panels/share.jsx'),
    PlayersPanel      = require('./panels/players.jsx'),
    TransactionsPanel = require('./panels/transactions.jsx');

var RosterMenu = React.createClass({
    render: function() {
      // console.log('traded');
      // console.log(this.props.teamData.players.traded);
      // console.log('acquired');
      // console.log(this.props.teamData.players.acquired);
      return (
        <div id="menu" className="section active">
          <SharePanel
            teamData={this.props.teamData}
            rosterInfo={this.props.rosterInfo}
            handleRosterSubmit={this.props.onRosterSubmit} />
          <PlayersPanel playerType="forwards" panelTitle="Forwards" panelId="forwards-list"
            playerData={this.props.teamData.players.forwards}
            acquiredPlayerData={this.props.teamData.players.acquired}
            tradedPlayerData={this.props.teamData.players.traded}
            activePlayers={this.props.activePlayers}
            activeTrade={this.props.activeTrade}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd}
            handleBenchDragEnter={this.props.onBenchDragEnter}
            handleBenchDragLeave={this.props.onBenchDragLeave} />
          <PlayersPanel playerType="defensemen" panelTitle="Defense" panelId="defense-list"
            playerData={this.props.teamData.players.defensemen}
            acquiredPlayerData={this.props.teamData.players.acquired}
            tradedPlayerData={this.props.teamData.players.traded}
            activePlayers={this.props.activePlayers}
            activeTrade={this.props.activeTrade}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd}
            handleBenchDragEnter={this.props.onBenchDragEnter}
            handleBenchDragLeave={this.props.onBenchDragLeave} />
          <PlayersPanel playerType="goaltenders" panelTitle="Goalies" panelId="goalies-list"
            playerData={this.props.teamData.players.goaltenders}
            acquiredPlayerData={this.props.teamData.players.acquired}
            tradedPlayerData={this.props.teamData.players.traded}
            activePlayers={this.props.activePlayers}
            activeTrade={this.props.activeTrade}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd}
            handleBenchDragEnter={this.props.onBenchDragEnter}
            handleBenchDragLeave={this.props.onBenchDragLeave} />
          <PlayersPanel playerType="inactive" panelTitle="Inactive" panelId="inactive-list"
            playerData={this.props.teamData.players.inactive}
            createdPlayerData={this.props.teamData.players.created}
            acquiredPlayerData={this.props.teamData.players.acquired}
            tradedPlayerData={this.props.teamData.players.traded}
            activePlayers={this.props.activePlayers}
            activeTrade={this.props.activeTrade}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd}
            handleBenchDragEnter={this.props.onBenchDragEnter}
            handleBenchDragLeave={this.props.onBenchDragLeave} />
          <TransactionsPanel
            playerData={this.props.playerData}
            activeTeam={this.props.activeTeam}
            activeTrade={this.props.activeTrade}
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
