// CapCrunch Transactions Panel
// ==================================================
'use strict';

var Trades       = require('./trades.jsx'),
    FreeAgents   = require('./freeagents.jsx'),
    CreatePlayer = require('./create.jsx');

var TransactionsPanel = React.createClass({
    render: function() {
      var haveData = this.props.teamData.id ? true : false;

      return (
        <div id="transactions" className="panel">
          <div className="title">Transactions</div>
          <div className={ haveData ? 'inner createplayer-active' : 'inner inactive' }>
            <ul id="transactions-menu">
              <li><a href="#" id="createplayer-tab" data-tabview="createplayer" className="active">Create Player</a></li>
              <li><a href="#" id="trades-tab" data-tabview="trades">Trades</a></li>
              <li><a href="#" id="freeagents-tab" data-tabview="freeagents">Free Agents</a></li>
            </ul>
            <CreatePlayer
              handleCreatePlayer={this.props.handleCreatePlayer} />
            <Trades />
            <FreeAgents />
            <div className="team-select-reminder">Select Team <i className="fa fa-hand-o-right"></i></div>
          </div>
        </div>
      );
    }
});

module.exports = TransactionsPanel;
