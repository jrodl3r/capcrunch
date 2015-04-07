// CapCrunch Transactions Panel
// ==================================================
'use strict';

var Trades       = require('./trades.jsx'),
    FreeAgents   = require('./freeagents.jsx'),
    CreatePlayer = require('./create.jsx');

var TransactionsPanel = React.createClass({
    render: function() {
      var haveData = this.props.activeTeam.length ? true : false;

      return (
        <div id="transactions" className="panel">
          <div className="title">Transactions</div>
          <div className={ haveData ? 'inner trades-active' : 'inner inactive' }>
            <ul id="transactions-menu">
              <li><a id="trades-tab" data-tabview="trades" className="active">Trades</a></li>
              <li><a id="freeagents-tab" data-tabview="freeagents">Free Agents</a></li>
              <li><a id="createplayer-tab" data-tabview="createplayer">Create Player</a></li>
            </ul>
            <Trades
              playerData={this.props.playerData}
              activeTeam={this.props.activeTeam}
              handleTradePlayers={this.props.handleTradePlayers}
              handleChangeTradeTeam={this.props.handleChangeTradeTeam} />
            <FreeAgents />
            <CreatePlayer
              handleCreatePlayer={this.props.handleCreatePlayer} />
            <div className="team-select-reminder">Select Team <i className="fa fa-hand-o-right"></i></div>
          </div>
        </div>
      );
    }
});

module.exports = TransactionsPanel;
