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
            playerData={this.props.teamData.players.forwards}
            activePlayers={this.props.activePlayers}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd}
            handleBenchDragEnter={this.props.onBenchDragEnter}
            handleBenchDragLeave={this.props.onBenchDragLeave} />
          <PlayersPanel playerType="defensemen" panelTitle="Defense" panelId="defense-list"
            playerData={this.props.teamData.players.defensemen}
            activePlayers={this.props.activePlayers}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd}
            handleBenchDragEnter={this.props.onBenchDragEnter}
            handleBenchDragLeave={this.props.onBenchDragLeave} />
          <PlayersPanel playerType="goaltenders" panelTitle="Goalies" panelId="goalies-list"
            playerData={this.props.teamData.players.goaltenders}
            activePlayers={this.props.activePlayers}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd}
            handleBenchDragEnter={this.props.onBenchDragEnter}
            handleBenchDragLeave={this.props.onBenchDragLeave} />
          <PlayersPanel playerType="inactive" panelTitle="Inactive" panelId="inactive-list"
            teamData={this.props.teamData}
            playerData={this.props.teamData.players.inactive}
            activePlayers={this.props.activePlayers}
            handleMouseDown={this.props.onMouseDown}
            handleMouseUp={this.props.onMouseUp}
            handleDragStart={this.props.onDragStart}
            handleDragEnd={this.props.onDragEnd}
            handleBenchDragEnter={this.props.onBenchDragEnter}
            handleBenchDragLeave={this.props.onBenchDragLeave} />
          <TransactionsPanel
            teamData={this.props.teamData}
            handleCreatePlayer={this.props.onCreatePlayer} />
        </div>
      );
    }
  });

module.exports = RosterMenu;
