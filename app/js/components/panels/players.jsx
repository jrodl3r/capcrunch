'use strict';

var UI = require('../../ui.js');

var PlayersPanel = React.createClass({

  buildPlayerList: function(players, group) {
    var list = players.map(function(player, i) {
      if (/(inplay|ir|benched)/.test(player.status) || player.action === 'queued') {
        return <li key={ i + player.id } className="row inplay"></li>;
      } else if (player.action === 'traded') {
        return (
          <li key={ i + player.id } className="row traded">
            <div className="item" data-group={group} data-index={i}>
              <div className="jersey">{player.jersey}</div>
              <div className="name">{player.lastname}<span>, </span>{player.firstname}</div>
              { group !== 'goaltenders' ? <div className="info"><span className="shot">{player.shot}</span>
              { group !== 'defensemen' ? <span className="position">{ player.shot ? '/' + player.position : player.position }</span> : null }
              </div> : null }
              <div className="handle"></div>
              <div className="salary">{ player.contract[0] !== '0.000' ? player.contract[0] : '-' }</div>
              <div className="status"><div className="tag traded">T</div></div>
            </div>
          </li>
        );
      } else {
        return (
          <li key={ i + player.id } className="row">
            <div className="item" data-group={group} data-index={i} draggable="true"
              onMouseEnter={this.props.onItemMouseEnter}
              onMouseLeave={this.props.onItemMouseLeave}
              onMouseDown={this.props.onItemMouseDown}
              onMouseUp={this.props.onItemMouseUp}
              onDragStart={this.props.onItemDragStart}
              onDragEnd={this.props.onItemDragEnd}>
              <div className="inner">
                <div className="jersey">{player.jersey}</div>
                <div className="name">{player.lastname}<span>, </span>{player.firstname}</div>
                { group !== 'goaltenders' ? <div className="info"><span className="shot">{player.shot}</span>
                { group !== 'defensemen' ? <span className="position">{ player.shot ? '/' + player.position : player.position }</span> : null }
                </div> : null }
                <div className="handle"></div>
                <div className="salary">{ player.contract[0] !== '0.000' ? player.contract[0] : '-' }</div>
                <div className="status">
                { player.action === 'acquired' ? <div className="tag acquired">A</div> : null }
                { player.status === 'injured' ? <div className="tag injured">IR</div> : null }
                { group === 'created' ? <div className="tag created">C</div> : null }
                </div>
              </div>
            </div>
          </li>
        );
      }
    }.bind(this));
    return list;
  },

  render: function() {

    return (
      <div id={this.props.panelId} className={ this.props.playerType === 'goaltenders' ? 'panel short player-list' : 'panel player-list' }>
        <div className="title">{this.props.panelTitle}
          <a onClick={UI.togglePanelView}><i className="fa fa-chevron-up"></i></a>
        </div>
    { this.props.playerGroup.length
      ? <div className="inner">
      { this.props.playerType === 'inactive' && this.props.createdData
        ? <ul>{ this.props.createdData.length && this.props.createdData[0].team === this.props.playerGroup[0].team
                ? this.buildPlayerList(this.props.createdData, 'created') : null }
              {this.buildPlayerList(this.props.playerGroup, this.props.playerType)}</ul>
        : <ul>{this.buildPlayerList(this.props.playerGroup, this.props.playerType)}</ul> }
        </div> : null }
        <div className={ this.props.panelData.engaged ? 'list-drag-cover active' : 'list-drag-cover' }
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

module.exports = PlayersPanel;
