'use strict';

var Trades       = require('./trades.jsx'),
    FreeAgents   = require('./freeagents.jsx'),
    CreatePlayer = require('./create.jsx'),
    UI           = require('../../ui.js');

var ActionsPanel = React.createClass({

  render: function() {

    var userCount   = this.props.tradeData.user.length + this.props.tradeData.picks.user.length,
        leagueCount = this.props.tradeData.league.length + this.props.tradeData.picks.league.length,
        activeTab   = this.props.panelData.active + '-active',
        tradeSize   = userCount > leagueCount ? ' trade-size-' + userCount : ' trade-size-' + leagueCount,
        activePanel = activeTab === 'trades' ? activeTab + tradeSize : activeTab;

    return (
      <div id="actions" className={ this.props.panelData.loading ? 'panel loading' : 'panel' }>
        <div className="title">Transactions</div>
        <div className={ 'inner ' + activePanel + tradeSize }>
          <ul id="actions-menu">
            <li><a id="trades-tab" data-tab="trades" className={ this.props.panelData.active === 'trades' ? 'active' : '' } onClick={this.props.toggleActionsTab}>Trades</a></li>
            <li><a id="freeagents-tab" data-tab="freeagents" className={ this.props.panelData.active === 'freeagents' ? 'active' : '' } onClick={this.props.toggleActionsTab}>Free Agents</a></li>
            <li><a id="createplayer-tab" data-tab="createplayer" className={ this.props.panelData.active === 'createplayer' ? 'active' : '' } onClick={this.props.toggleActionsTab}>Create Player</a></li>
          </ul>
          <Trades
            tradeSize={tradeSize}
            year={this.props.year}
            activeTab={this.props.panelData.active}
            teamData={this.props.teamData}
            pickData={this.props.pickData}
            tradeTeam={this.props.tradeTeam}
            tradeData={this.props.tradeData}
            playerData={this.props.playerData}
            executeTrade={this.props.executeTrade}
            changeTradeTeam={this.props.changeTradeTeam}
            addTradePick={this.props.addTradePick}
            addTradePlayer={this.props.addTradePlayer}
            removeTradePlayer={this.props.removeTradePlayer}
            onTradeDragEnter={this.props.onTradeDragEnter} />
          <FreeAgents activeTab={this.props.panelData.active} />
          <CreatePlayer activeTab={this.props.panelData.active} createPlayer={this.props.createPlayer} />
          <div id="actions-disabled-cover" className={ !this.props.panelData.enabled ? 'active' : '' }>
            <p>Transactions are disabled (Allstar-Mode)</p>
            <p>To Re-enable:</p>
            <p>#1 » Switch back to your active team ({this.props.playerData.team})</p>
            <p>#2 » Remove players from other teams</p>
            <p>#3 » Undo trades (Coming Soon)</p>
            <p>»»» TBD «««</p>
          </div>
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
