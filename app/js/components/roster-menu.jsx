'use strict';

var SharePanel   = require('./panels/share.jsx'),
    PlayersPanel = require('./panels/players.jsx'),
    ActionsPanel = require('./panels/actions.jsx');

var RosterMenu = React.createClass({

  render: function() {

    var showRemove  = this.props.dragData.type === 'tile' ? ' show-remove-player' : '',
        showLoading = this.props.panelData.loading ? ' show-loading' : '',
        listEngaged = this.props.panelData.engaged ? ' list-engaged' : '',
        activeView  = this.props.viewData.active === 'roster' ? 'section active' + showRemove + showLoading + listEngaged : 'section';

    return (
      <div id="menu" className={activeView}>
        <SharePanel
          teamName={this.props.teamData.name}
          shareData={this.props.shareData}
          resetShare={this.props.resetShare}
          saveRoster={this.props.saveRoster} />
        <PlayersPanel playerType="forwards" panelTitle="Forwards" panelId="forwards-list"
          dragType={this.props.dragData.type}
          tradeData={this.props.tradeData}
          playerData={this.props.playerData}
          playerGroup={this.props.teamData.players.forwards}
          onItemMouseDown={this.props.onItemMouseDown}
          onItemMouseUp={this.props.onItemMouseUp}
          onItemDragStart={this.props.onItemDragStart}
          onItemDragEnd={this.props.onItemDragEnd}
          onListDragEnter={this.props.onListDragEnter}
          onRemoveDragEnter={this.props.onRemoveDragEnter}
          onRemoveDragLeave={this.props.onRemoveDragLeave} />
        <PlayersPanel playerType="defensemen" panelTitle="Defense" panelId="defense-list"
          dragType={this.props.dragData.type}
          tradeData={this.props.tradeData}
          playerData={this.props.playerData}
          playerGroup={this.props.teamData.players.defensemen}
          onItemMouseDown={this.props.onItemMouseDown}
          onItemMouseUp={this.props.onItemMouseUp}
          onItemDragStart={this.props.onItemDragStart}
          onItemDragEnd={this.props.onItemDragEnd}
          onListDragEnter={this.props.onListDragEnter}
          onRemoveDragEnter={this.props.onRemoveDragEnter}
          onRemoveDragLeave={this.props.onRemoveDragLeave} />
        <PlayersPanel playerType="goaltenders" panelTitle="Goalies" panelId="goalies-list"
          dragType={this.props.dragData.type}
          tradeData={this.props.tradeData}
          playerData={this.props.playerData}
          playerGroup={this.props.teamData.players.goaltenders}
          onItemMouseDown={this.props.onItemMouseDown}
          onItemMouseUp={this.props.onItemMouseUp}
          onItemDragStart={this.props.onItemDragStart}
          onItemDragEnd={this.props.onItemDragEnd}
          onListDragEnter={this.props.onListDragEnter}
          onRemoveDragEnter={this.props.onRemoveDragEnter}
          onRemoveDragLeave={this.props.onRemoveDragLeave} />
        <PlayersPanel playerType="inactive" panelTitle="Inactive" panelId="inactive-list"
          dragType={this.props.dragData.type}
          tradeData={this.props.tradeData}
          playerData={this.props.playerData}
          playerGroup={this.props.teamData.players.inactive}
          onItemMouseDown={this.props.onItemMouseDown}
          onItemMouseUp={this.props.onItemMouseUp}
          onItemDragStart={this.props.onItemDragStart}
          onItemDragEnd={this.props.onItemDragEnd}
          onListDragEnter={this.props.onListDragEnter}
          onRemoveDragEnter={this.props.onRemoveDragEnter}
          onRemoveDragLeave={this.props.onRemoveDragLeave} />
        <ActionsPanel
          activeTab={this.props.panelData.active}
          dragType={this.props.dragData.type}
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
