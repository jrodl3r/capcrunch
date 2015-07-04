'use strict';

var Players = require('./players.jsx'),
    UI = require('../../ui.js');

var Inactive = React.createClass({

  changeTab: function(e) {
    e.preventDefault();
    var tab = e.currentTarget.getAttribute('data-tab');
    if (!/disabled/.test(e.currentTarget.className)) {
      this.props.changePanelTab('inactive', tab);
    }
    if (e.currentTarget.className !== 'disabled') {
      if (tab === 'inactive') { $('#inactive-menu li.tracker').css('left', '4.5%').css('width', '69px'); }
      // else if (tab === 'prospects') { $('#active-menu li.tracker').css('left', 'XX%').css('width', 'XXpx'); }
      else { $('#inactive-menu li.tracker').css('left', '72.5%').css('width', '68px'); }
    }
  },

  render: function() {
    var created = this.props.panelData.inactive === 'created' ? 'active' : '';

    return (
      <div id="inactive" className="panel">
        <ul id="inactive-menu" className="tab-bar">
          <li>
            <a id="signed-tab" data-tab="inactive" onClick={this.changeTab}
              className={ this.props.panelData.inactive === 'inactive' ? 'active' : '' }>Inactive</a></li>
          <li><a id="prospects-tab" data-tab="prospects" className="disabled">Prospects</a></li>
          <li>
            <a id="created-tab" data-tab="created" onClick={this.changeTab}
              className={ this.props.playerData.created.length ? created : 'disabled' }>Created</a></li>
          <li className="tracker"></li>
        </ul>
        <div className="inner">
          <Players panelId="inactive-list" playerType="inactive" view="inactive"
            year={this.props.year}
            dragType={this.props.dragType}
            panelData={this.props.panelData}
            tradeData={this.props.tradeData}
            activeTeam={this.props.teamData.id}
            playerData={this.props.teamData.players.inactive}
            onItemMouseEnter={this.props.onItemMouseEnter}
            onItemMouseLeave={this.props.onItemMouseLeave}
            onItemMouseDown={this.props.onItemMouseDown}
            onItemMouseUp={this.props.onItemMouseUp}
            onItemDragStart={this.props.onItemDragStart}
            onItemDragEnd={this.props.onItemDragEnd} />
          <Players panelId="prospects-list" playerType="prospects" view="prospects"
            year={this.props.year}
            dragType={this.props.dragType}
            panelData={this.props.panelData}
            tradeData={this.props.tradeData}
            activeTeam={this.props.teamData.id}
            playerData={this.props.teamData.players.inactive}
            onItemMouseEnter={this.props.onItemMouseEnter}
            onItemMouseLeave={this.props.onItemMouseLeave}
            onItemMouseDown={this.props.onItemMouseDown}
            onItemMouseUp={this.props.onItemMouseUp}
            onItemDragStart={this.props.onItemDragStart}
            onItemDragEnd={this.props.onItemDragEnd} />
          <Players panelId="created-list" playerType="created" view="created"
            year={this.props.year}
            dragType={this.props.dragType}
            panelData={this.props.panelData}
            tradeData={this.props.tradeData}
            activeTeam={this.props.teamData.id}
            playerData={this.props.playerData.created}
            onItemMouseEnter={this.props.onItemMouseEnter}
            onItemMouseLeave={this.props.onItemMouseLeave}
            onItemMouseDown={this.props.onItemMouseDown}
            onItemMouseUp={this.props.onItemMouseUp}
            onItemDragStart={this.props.onItemDragStart}
            onItemDragEnd={this.props.onItemDragEnd} />
        </div>
        <div className={ this.props.panelData.engaged ? 'drag-cover active' : 'drag-cover' }
          onDragEnter={this.props.onListDragEnter}
          onDragOver={UI.dropEffect}></div>
        <div className={ this.props.panelData.loading ? 'loading-list active' : 'loading-list' }>
          <i className="fa fa-cog fa-spin"></i> Loading
        </div>
        <div className={ this.props.dragType === 'tile' ? 'remove-player active' : 'remove-player' }>
          <i className="fa fa-rotate-left"></i> Remove Player
          <div className="cover"
            onDragOver={UI.dropEffect}
            onDragEnter={this.props.onRemoveDragEnter}
            onDragLeave={this.props.onRemoveDragLeave}>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Inactive;
