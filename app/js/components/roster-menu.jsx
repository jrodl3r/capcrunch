'use strict';

var SharePanel    = require('./panels/share.jsx'),
    OverviewPanel = require('./panels/overview.jsx'),
    PlayersPanel  = require('./panels/players.jsx'),
    ActionsPanel  = require('./panels/actions.jsx');

var RosterMenu = React.createClass({

  render: function() {

    return (
      <div id="menu" className={ this.props.viewData.active === 'roster' ? 'section active' : 'section' }>
        <SharePanel
          teamName={this.props.teamData.name}
          shareData={this.props.shareData}
          resetShare={this.props.resetShare}
          shareRoster={this.props.shareRoster} />
        <OverviewPanel
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
        <PlayersPanel playerType="forwards" panelTitle="Forwards" panelId="forwards-list"
          year={this.props.capData.year}
          dragType={this.props.dragData.type}
          panelData={this.props.panelData}
          tradeData={this.props.tradeData}
          playerGroup={this.props.teamData.players.forwards}
          onItemMouseEnter={this.props.onItemMouseEnter}
          onItemMouseLeave={this.props.onItemMouseLeave}
          onItemMouseDown={this.props.onItemMouseDown}
          onItemMouseUp={this.props.onItemMouseUp}
          onItemDragStart={this.props.onItemDragStart}
          onItemDragEnd={this.props.onItemDragEnd}
          onListDragEnter={this.props.onListDragEnter}
          onRemoveDragEnter={this.props.onRemoveDragEnter}
          onRemoveDragLeave={this.props.onRemoveDragLeave} />
        <PlayersPanel playerType="defensemen" panelTitle="Defense" panelId="defense-list"
          year={this.props.capData.year}
          dragType={this.props.dragData.type}
          panelData={this.props.panelData}
          tradeData={this.props.tradeData}
          playerGroup={this.props.teamData.players.defensemen}
          onItemMouseEnter={this.props.onItemMouseEnter}
          onItemMouseLeave={this.props.onItemMouseLeave}
          onItemMouseDown={this.props.onItemMouseDown}
          onItemMouseUp={this.props.onItemMouseUp}
          onItemDragStart={this.props.onItemDragStart}
          onItemDragEnd={this.props.onItemDragEnd}
          onListDragEnter={this.props.onListDragEnter}
          onRemoveDragEnter={this.props.onRemoveDragEnter}
          onRemoveDragLeave={this.props.onRemoveDragLeave} />
        <PlayersPanel playerType="goaltenders" panelTitle="Goalies" panelId="goalies-list"
          year={this.props.capData.year}
          dragType={this.props.dragData.type}
          panelData={this.props.panelData}
          tradeData={this.props.tradeData}
          playerGroup={this.props.teamData.players.goaltenders}
          onItemMouseEnter={this.props.onItemMouseEnter}
          onItemMouseLeave={this.props.onItemMouseLeave}
          onItemMouseDown={this.props.onItemMouseDown}
          onItemMouseUp={this.props.onItemMouseUp}
          onItemDragStart={this.props.onItemDragStart}
          onItemDragEnd={this.props.onItemDragEnd}
          onListDragEnter={this.props.onListDragEnter}
          onRemoveDragEnter={this.props.onRemoveDragEnter}
          onRemoveDragLeave={this.props.onRemoveDragLeave} />
        <PlayersPanel playerType="inactive" panelTitle="Inactive" panelId="inactive-list"
          year={this.props.capData.year}
          dragType={this.props.dragData.type}
          panelData={this.props.panelData}
          tradeData={this.props.tradeData}
          createdData={this.props.playerData.created}
          activeTeam={this.props.teamData.id}
          playerGroup={this.props.teamData.players.inactive}
          onItemMouseEnter={this.props.onItemMouseEnter}
          onItemMouseLeave={this.props.onItemMouseLeave}
          onItemMouseDown={this.props.onItemMouseDown}
          onItemMouseUp={this.props.onItemMouseUp}
          onItemDragStart={this.props.onItemDragStart}
          onItemDragEnd={this.props.onItemDragEnd}
          onListDragEnter={this.props.onListDragEnter}
          onRemoveDragEnter={this.props.onRemoveDragEnter}
          onRemoveDragLeave={this.props.onRemoveDragLeave} />
        <ActionsPanel
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
          toggleActionsTab={this.props.onToggleActionsTab} />
      </div>
    );
  }
});

module.exports = RosterMenu;
