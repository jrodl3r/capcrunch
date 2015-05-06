// CapCrunch Transactions Panel
// ==================================================
'use strict';

var Trades       = require('./trades.jsx'),
    FreeAgents   = require('./freeagents.jsx'),
    CreatePlayer = require('./create.jsx');

var ActionsPanel = React.createClass({
    getInitialState: function() {
      return { activeTab : 'trades' };
    },
    toggleTab: function(e) {
      var button = e.currentTarget,
          tab    = button.dataset.tab;
      e.preventDefault();
      if (tab !== this.state.activeTab) {
        this.setState({ activeTab : tab });
      }
    },

    render: function() {
      var haveData      = this.props.activeTeam.length ? true : false,
          activeIdList  = this.props.activeTrade.active.id_list,
          passiveIdList = this.props.activeTrade.passive.id_list,
          tradeSize = activeIdList.length === 3 || passiveIdList.length === 3 ? ' three-player-trade' : '',
          tradeSize = activeIdList.length === 4 || passiveIdList.length === 4 ? ' four-player-trade' : tradeSize,
          tradeSize = activeIdList.length === 5 || passiveIdList.length === 5 ? ' five-player-trade' : tradeSize,
          tab = this.state.activeTab;

      return (
        <div id="actions" className="panel">
          <div className="title">Transactions</div>
          <div className={ haveData ? 'inner ' + tab + '-active' + tradeSize : 'inner inactive' }>
            <ul id="actions-menu">
              <li>
                <a id="trades-tab" data-tab="trades"
                  className={ tab === 'trades' ? 'active' : '' }
                  onClick={this.toggleTab}>Trades</a>
              </li>
              <li>
                <a id="freeagents-tab" data-tab="freeagents"
                  className={ tab === 'freeagents' ? 'active' : '' }
                  onClick={this.toggleTab}>Free Agents</a>
              </li>
              <li>
                <a id="createplayer-tab" data-tab="createplayer"
                  className={ tab === 'createplayer' ? 'active' : '' }
                  onClick={this.toggleTab}>Create Player</a>
              </li>
            </ul>
            <Trades
              activeTab={this.state.activeTab}
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
            <FreeAgents
              activeTab={this.state.activeTab} />
            <CreatePlayer
              activeTab={this.state.activeTab}
              handleCreatePlayer={this.props.handleCreatePlayer} />
          </div>
        </div>
      );
    }
});

module.exports = ActionsPanel;
