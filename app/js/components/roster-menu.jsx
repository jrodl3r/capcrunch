'use strict';

var SharePanel   = require('./panels/share.jsx'),
    PlayersPanel = require('./panels/players.jsx'),
    ActionsPanel = require('./panels/actions.jsx');

var RosterMenu = React.createClass({

  render: function() {

    return (
      <div id="menu" className={ this.props.viewData.active === 'roster' ? 'section active' : 'section' }>
        <SharePanel
          teamName={this.props.teamData.name}
          shareData={this.props.shareData}
          resetShare={this.props.resetShare}
          saveRoster={this.props.saveRoster} />
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
          dragType={this.props.dragData.type}
          panelData={this.props.panelData}
          teamData={this.props.teamData}
          tradeTeam={this.props.tradeTeam}
          tradeData={this.props.tradeData}
          playerData={this.props.playerData}
          createPlayer={this.props.createPlayer}
          executeTrade={this.props.executeTrade}
          changeTradeTeam={this.props.changeTradeTeam}
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
