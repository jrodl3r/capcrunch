'use strict';

var Players = require('./players.jsx'),
    UI = require('../../ui.js');

var Active = React.createClass({

  changeTab: function(e) {
    e.preventDefault();
    var tab = e.currentTarget.getAttribute('data-tab');
    this.props.changePanelTab('active', tab);
    if (tab === 'forwards') { $('#active-menu li.tracker').css('left', '4.5%').css('width', '82px'); }
    else if (tab === 'defense') { $('#active-menu li.tracker').css('left', '40%').css('width', '72px'); }
    else { $('#active-menu li.tracker').css('left', '73.5%').css('width', '65px'); }
  },

  render: function() {

    return (
      <div id="active" className="panel">
        <ul id="active-menu" className="tab-bar">
          <li>
            <a id="forwards-tab" data-tab="forwards" className={ this.props.panelData.active === 'forwards' ? 'active' : '' }
              onClick={this.changeTab}>Forwards</a></li>
          <li>
            <a id="defense-tab" data-tab="defense" className={ this.props.panelData.active === 'defense' ? 'active' : '' }
              onClick={this.changeTab}>Defense</a></li>
          <li>
            <a id="goalies-tab" data-tab="goalies" className={ this.props.panelData.active === 'goalies' ? 'active' : '' }
              onClick={this.changeTab}>Goalies</a></li>
          <li className="tracker"></li>
        </ul>
        <div className="inner">
          <Players panelId="forwards-list" playerType="forwards" view="forwards"
            year={this.props.year}
            dragType={this.props.dragType}
            panelData={this.props.panelData}
            tradeData={this.props.tradeData}
            playerData={this.props.teamData.players.forwards}
            onItemMouseEnter={this.props.onItemMouseEnter}
            onItemMouseLeave={this.props.onItemMouseLeave}
            onItemMouseDown={this.props.onItemMouseDown}
            onItemMouseUp={this.props.onItemMouseUp}
            onItemDragStart={this.props.onItemDragStart}
            onItemDragEnd={this.props.onItemDragEnd} />
          <Players panelId="defense-list" playerType="defensemen" view="defense"
            year={this.props.year}
            dragType={this.props.dragType}
            panelData={this.props.panelData}
            tradeData={this.props.tradeData}
            playerData={this.props.teamData.players.defensemen}
            onItemMouseEnter={this.props.onItemMouseEnter}
            onItemMouseLeave={this.props.onItemMouseLeave}
            onItemMouseDown={this.props.onItemMouseDown}
            onItemMouseUp={this.props.onItemMouseUp}
            onItemDragStart={this.props.onItemDragStart}
            onItemDragEnd={this.props.onItemDragEnd} />
          <Players panelId="goalies-list" playerType="goaltenders" view="goalies"
            year={this.props.year}
            dragType={this.props.dragType}
            panelData={this.props.panelData}
            tradeData={this.props.tradeData}
            playerData={this.props.teamData.players.goaltenders}
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

module.exports = Active;
