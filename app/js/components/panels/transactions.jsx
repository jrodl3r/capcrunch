// CapCrunch Transactions Panel
// ==================================================
'use strict';

var Trades       = require('./trades.jsx'),
    FreeAgents   = require('./freeagents.jsx'),
    CreatePlayer = require('./create.jsx');

var TransactionsPanel = React.createClass({
    render: function() {
      var haveData        = this.props.activeTeam.length ? true : false,
          activeIdList    = this.props.activeTrade.active.id_list,
          passiveIdList   = this.props.activeTrade.passive.id_list,
          playerTradeSize = '',
          threePlayerDeal = activeIdList.length === 3 || passiveIdList.length === 3 ? true : false,
          fourPlayerDeal  = activeIdList.length === 4 || passiveIdList.length === 4 ? true : false,
          fivePlayerDeal  = activeIdList.length === 5 || passiveIdList.length === 5 ? true : false;
      if (threePlayerDeal) { playerTradeSize = ' three-player-trade'; }
      if (fourPlayerDeal)  { playerTradeSize = ' four-player-trade'; }
      if (fivePlayerDeal)  { playerTradeSize = ' five-player-trade'; }

      return (
        <div id="transactions" className="panel">
          <div className="title">Transactions</div>
          <div className={ haveData ? 'inner trades-active' + playerTradeSize : 'inner inactive' }>
            <ul id="transactions-menu">
              <li><a id="trades-tab" data-tabview="trades" className="active">Trades</a></li>
              <li><a id="freeagents-tab" data-tabview="freeagents">Free Agents</a></li>
              <li><a id="createplayer-tab" data-tabview="createplayer">Create Player</a></li>
            </ul>
            <Trades
              playerData={this.props.playerData}
              activeTeam={this.props.activeTeam}
              activeTrade={this.props.activeTrade}
              activePlayers={this.props.activePlayers}
              handleTradeExecution={this.props.handleTradeExecution}
              handleChangeTradeTeam={this.props.handleChangeTradeTeam}
              handleAddTradePlayer={this.props.handleAddTradePlayer}
              handleRemoveTradePlayer={this.props.handleRemoveTradePlayer}
              handleTradeDragEnter={this.props.handleTradeDragEnter}
              handleTradeDragLeave={this.props.handleTradeDragLeave} />
            <FreeAgents />
            <CreatePlayer
              handleCreatePlayer={this.props.handleCreatePlayer} />
            <div className="team-select-reminder"></div>
          </div>
        </div>
      );
    }
});

module.exports = TransactionsPanel;
