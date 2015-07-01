'use strict';

var Trades       = require('./trades.jsx'),
    FreeAgents   = require('./freeagents.jsx'),
    CreatePlayer = require('./create.jsx'),
    UI           = require('../../ui.js');

var ActionsPanel = React.createClass({

  changeView: function(e) {
    e.preventDefault();
    $('#team-grid div.active').removeClass('active');
    $('#team-grid div.' + this.props.playerData.team).addClass('active');
    this.props.changeView('teams');
  },

  changeTab: function(e) {
    e.preventDefault();
    var tab = e.currentTarget.getAttribute('data-tab');
    this.props.changePanelTab('actions', tab);
  },

  render: function() {

    var userCount   = this.props.tradeData.user.length + this.props.tradeData.picks.user.length,
        leagueCount = this.props.tradeData.league.length + this.props.tradeData.picks.league.length,
        activeTab   = this.props.panelData.actions + '-active',
        tradeSize   = userCount > leagueCount ? ' trade-size-' + userCount : ' trade-size-' + leagueCount,
        activePanel = activeTab === 'trades' ? activeTab + tradeSize : activeTab;

    return (
      <div id="actions" className={ this.props.panelData.loading ? 'panel loading' : 'panel' }>
        <div className={ 'inner ' + activePanel + tradeSize }>
          <ul id="actions-menu">
            <li>
              <a id="trades-tab" data-tab="trades" className={ this.props.panelData.actions === 'trades' ? 'active' : '' }
                onClick={this.changeTab}>Trades</a></li>
            <li>
              <a id="freeagents-tab" data-tab="freeagents" className={ this.props.panelData.actions === 'freeagents' ? 'active' : '' }
                onClick={this.changeTab}>Free Agents</a></li>
            <li>
              <a id="createplayer-tab" data-tab="createplayer" className={ this.props.panelData.actions === 'createplayer' ? 'active' : '' }
                onClick={this.changeTab}>Create Player</a></li>
          </ul>
          <Trades
            tradeSize={tradeSize}
            year={this.props.year}
            panelData={this.props.panelData}
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
          <FreeAgents activeTab={this.props.panelData.actions} />
          <CreatePlayer activeTab={this.props.panelData.actions} createPlayer={this.props.createPlayer} />
          <div id="actions-drag-cover"
            className={ this.props.dragType ? 'active' : '' }
            onDragEnter={this.props.onTradeDragEnter}
            onDragLeave={this.props.onTradeDragLeave}
            onDragOver={UI.dropEffect}>
          </div>
          <div id="actions-disabled-cover" className={ !this.props.panelData.enabled ? 'active' : '' }>
            <span className="info-bubble"><strong>Allstar-Mode</strong> is enabled whenenver the active team does not match your roster players.</span>
            <p>Allstar Mode <i className="fa fa-info-circle"></i><br/>
            { this.props.playerData.team !== this.props.teamData.id
              ? <a onClick={this.changeView}>Switch back to active team ({this.props.playerData.team})</a> : null }
            </p>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ActionsPanel;
