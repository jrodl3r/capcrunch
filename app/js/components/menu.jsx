'use strict';

var Share    = require('./panels/share.jsx'),
    Overview = require('./panels/overview.jsx'),
    Active   = require('./panels/active.jsx'),
    Inactive = require('./panels/inactive.jsx'),
    Players  = require('./panels/players.jsx'),
    Actions  = require('./panels/actions.jsx');

var Menu = React.createClass({

  render: function() {

    return (
      <div id="menu" className={ this.props.viewData.active === 'roster' ? 'section active' : 'section' }>
        <Share
          teamName={this.props.teamData.name}
          shareData={this.props.shareData}
          resetShare={this.props.resetShare}
          shareRoster={this.props.shareRoster} />
        <Overview
          changeView={this.props.changeView}
          dragType={this.props.dragData.type}
          activeTeam={this.props.teamData.id}
          userTeam={this.props.playerData.team}
          unsigned={this.props.playerData.unsigned}
          signed={this.props.playerData.signed}
          created={this.props.playerData.created}
          trades={this.props.tradeData.trades}
          undoTrade={this.props.undoTrade}
          undoCreate={this.props.undoCreate}
          signPlayer={this.props.signPlayer}
          undoSigning={this.props.undoSigning}
          onRemoveDragEnter={this.props.onRemoveDragEnter}
          onRemoveDragLeave={this.props.onRemoveDragLeave} />
        <Active
          year={this.props.capData.year}
          dragType={this.props.dragData.type}
          panelData={this.props.panelData}
          tradeData={this.props.tradeData}
          teamData={this.props.teamData}
          onItemMouseEnter={this.props.onItemMouseEnter}
          onItemMouseLeave={this.props.onItemMouseLeave}
          onItemMouseDown={this.props.onItemMouseDown}
          onItemMouseUp={this.props.onItemMouseUp}
          onItemDragStart={this.props.onItemDragStart}
          onItemDragEnd={this.props.onItemDragEnd}
          onListDragEnter={this.props.onListDragEnter}
          onRemoveDragEnter={this.props.onRemoveDragEnter}
          onRemoveDragLeave={this.props.onRemoveDragLeave}
          changePanelTab={this.props.changePanelTab} />
        <Inactive
          year={this.props.capData.year}
          dragType={this.props.dragData.type}
          panelData={this.props.panelData}
          tradeData={this.props.tradeData}
          teamData={this.props.teamData}
          playerData={this.props.playerData}
          onItemMouseEnter={this.props.onItemMouseEnter}
          onItemMouseLeave={this.props.onItemMouseLeave}
          onItemMouseDown={this.props.onItemMouseDown}
          onItemMouseUp={this.props.onItemMouseUp}
          onItemDragStart={this.props.onItemDragStart}
          onItemDragEnd={this.props.onItemDragEnd}
          onListDragEnter={this.props.onListDragEnter}
          onRemoveDragEnter={this.props.onRemoveDragEnter}
          onRemoveDragLeave={this.props.onRemoveDragLeave}
          changePanelTab={this.props.changePanelTab} />
        <Actions
          year={this.props.capData.year}
          changeView={this.props.changeView}
          dragType={this.props.dragData.type}
          panelData={this.props.panelData}
          teamData={this.props.teamData}
          tradeTeam={this.props.tradeTeam}
          tradeData={this.props.tradeData}
          pickData={this.props.pickData}
          playerData={this.props.playerData}
          createPlayer={this.props.createPlayer}
          executeTrade={this.props.executeTrade}
          changeTradeTeam={this.props.changeTradeTeam}
          addTradePick={this.props.addTradePick}
          addTradePlayer={this.props.addTradePlayer}
          removeTradePlayer={this.props.removeTradePlayer}
          onTradeDragEnter={this.props.onTradeDragEnter}
          onTradeDragLeave={this.props.onTradeDragLeave}
          changePanelTab={this.props.changePanelTab} />
      </div>
    );
  }
});

module.exports = Menu;
