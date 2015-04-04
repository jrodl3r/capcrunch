// CapCrunch Transactions Panel
// ==================================================
'use strict';

var Trades       = require('./trades.jsx'),
    FreeAgents   = require('./freeagents.jsx'),
    CreatePlayer = require('./create.jsx');

var TransactionsPanel = React.createClass({
    render: function() {
      return (
        <div id="transactions" className="panel">
          <div className="title">Transactions</div>
          <div className="inner createplayer-active">
            <ul id="transactions-menu">
              <li><a id="createplayer-tab" data-tabview="createplayer" className="active">Create Player</a></li>
              <li><a id="trades-tab" data-tabview="trades">Trades</a></li>
              <li><a id="freeagents-tab" data-tabview="freeagents">Free Agents</a></li>
            </ul>
            <CreatePlayer
              handleCreatePlayer={this.props.handleCreatePlayer} />
            <Trades />
            <FreeAgents />
          </div>
        </div>
      );
    }
});

module.exports = TransactionsPanel;
