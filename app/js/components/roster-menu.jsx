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
            teamData={this.props.teamData}
            leagueData={this.props.leagueData}
            playerData={this.props.teamData.players.forwards}
            activeTrade={this.props.activeTrade}
            activePlayers={this.props.activePlayers}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd}
            handleBenchDragEnter={this.props.onBenchDragEnter}
            handleBenchDragLeave={this.props.onBenchDragLeave} />
          <PlayersPanel playerType="defensemen" panelTitle="Defense" panelId="defense-list"
            teamData={this.props.teamData}
            leagueData={this.props.leagueData}
            playerData={this.props.teamData.players.defensemen}
            activeTrade={this.props.activeTrade}
            activePlayers={this.props.activePlayers}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd}
            handleBenchDragEnter={this.props.onBenchDragEnter}
            handleBenchDragLeave={this.props.onBenchDragLeave} />
          <PlayersPanel playerType="goaltenders" panelTitle="Goalies" panelId="goalies-list"
            teamData={this.props.teamData}
            leagueData={this.props.leagueData}
            playerData={this.props.teamData.players.goaltenders}
            activeTrade={this.props.activeTrade}
            activePlayers={this.props.activePlayers}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd}
            handleBenchDragEnter={this.props.onBenchDragEnter}
            handleBenchDragLeave={this.props.onBenchDragLeave} />
          <PlayersPanel playerType="inactive" panelTitle="Inactive" panelId="inactive-list"
            teamData={this.props.teamData}
            leagueData={this.props.leagueData}
            playerData={this.props.teamData.players.inactive}
            activeTrade={this.props.activeTrade}
            activePlayers={this.props.activePlayers}
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
