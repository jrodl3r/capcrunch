'use strict';

var Trades       = require('./trades.jsx'),
    FreeAgents   = require('./freeagents.jsx'),
    CreatePlayer = require('./create.jsx'),
    UI           = require('../../ui.js');

var ActionsPanel = React.createClass({

  render: function() {

    var userCount   = this.props.tradeData.user.length,
        leagueCount = this.props.tradeData.league.length,
        activeTab   = this.props.activeTab + '-active',
        tradeSize   = userCount > leagueCount ? ' trade-size-' + userCount : ' trade-size-' + leagueCount,
        activePanel = this.props.activeTab === 'trades' ? activeTab + tradeSize : activeTab;

    return (
      <div id="actions" className="panel">
        <div className="title">Transactions</div>
        <div className={ 'inner ' + activePanel }>
          <ul id="actions-menu">
            <li>
              <a id="trades-tab" data-tab="trades"
                className={ this.props.activeTab === 'trades' ? 'active' : '' }
                onClick={this.props.toggleActionsTab}>Trades</a>
            </li>
            <li>
              <a id="freeagents-tab" data-tab="freeagents"
                className={ this.props.activeTab === 'freeagents' ? 'active' : '' }
                onClick={this.props.toggleActionsTab}>Free Agents</a>
            </li>
            <li>
              <a id="createplayer-tab" data-tab="createplayer"
                className={ this.props.activeTab === 'createplayer' ? 'active' : '' }
                onClick={this.props.toggleActionsTab}>Create Player</a>
            </li>
          </ul>
          <Trades
            tradeSize={tradeSize}
            activeTab={this.props.activeTab}
            teamData={this.props.teamData}
            tradeTeam={this.props.tradeTeam}
            tradeData={this.props.tradeData}
            playerData={this.props.playerData}
            executeTrade={this.props.executeTrade}
            changeTradeTeam={this.props.changeTradeTeam}
            addTradePlayer={this.props.addTradePlayer}
            removeTradePlayer={this.props.removeTradePlayer}
            onTradeDragEnter={this.props.onTradeDragEnter} />
          <FreeAgents activeTab={this.props.activeTab} />
          <CreatePlayer
            activeTab={this.props.activeTab}
            createPlayer={this.props.createPlayer} />
          <div id="actions-drag-cover"
            className={ this.props.dragType ? 'active' : '' }
            onDragEnter={this.props.onTradeDragEnter}
            onDragLeave={this.props.onTradeDragLeave}
            onDragOver={UI.dropEffect}>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ActionsPanel;
