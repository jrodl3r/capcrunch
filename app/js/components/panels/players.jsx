'use strict';

var UI = require('../../ui.js');

var PlayersPanel = React.createClass({

  buildPlayerList: function(players, group) {
    var have_injured = this.props.playerData.ir.length,
        have_benched = this.props.playerData.benched.length,
        have_queued = this.props.tradeData.user.length;

    var list = players.map(function(player, i) {
      // if (/(inplay|ir|benched)/.test(player.status) || (/(traded|queued|buyout)/.test(player.action)) {...}
      if (this.props.playerData.inplay.indexOf(player.id) !== -1) {
        return <li key={ i + player.id } className="row inplay"></li>;
      } else if (have_injured && this.props.playerData.ir.indexOf(player.id) !== -1) {
        return <li key={ i + player.id } className="row inplay"></li>;
      } else if (have_benched && this.props.playerData.benched.indexOf(player.id) !== -1) {
        return <li key={ i + player.id } className="row inplay"></li>;
      } else if (have_queued && this.props.tradeData.user.indexOf(player.id) !== -1) {
        return <li key={ i + player.id } className="row inplay"></li>
      } else {
        return (
          <li key={ i + player.id } className={ player.action ? 'row ' + player.action : 'row' }>
            <div className="item" data-group={group} data-index={i} draggable={ player.action !== 'traded' ? true : false }
              onMouseDown={this.props.onItemMouseDown}
              onMouseUp={this.props.onItemMouseUp}
              onDragStart={this.props.onItemDragStart}
              onDragEnd={this.props.onItemDragEnd}>
              <div className="jersey">{player.jersey}</div>
              <div className="name">{player.lastname}<span>, </span>{player.firstname}</div>
          { group !== 'goaltenders'
            ? <div className="info">
                <span className="shot">{player.shot}</span>
            { group !== 'defensemen'
              ? <span className="position">{ player.shot ? '/' + player.position : player.position }</span> : null }
              </div> : null }
              <div className="handle"></div>
              <div className="salary">{ player.contract[0] !== '0.000' ? player.contract[0] : '-' }</div>
              <div className="status">
            { player.action === 'traded' ? <div className="traded">T</div> : null }
            { player.action === 'acquired' ? <div className="acquired">A</div> : null }
            { player.status === 'injured' ? <div className="injured">IR</div> : null }
            { group === 'created' ? <div className="created">C</div> : null }
              </div>
              <div className="cover"></div>
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
      { this.props.playerType === 'inactive' && this.props.playerData.created.length
        ? <ul>{this.buildPlayerList(this.props.playerData.created, 'created')}
              {this.buildPlayerList(this.props.playerGroup, this.props.playerType)}</ul>
        : <ul>{this.buildPlayerList(this.props.playerGroup, this.props.playerType)}</ul> }
        </div> : null }
        <div className="loading-list"><i className="fa fa-cog fa-spin"></i> Loading</div>
        <div className="list-drag-cover" onDragOver={UI.dropEffect} onDragEnter={this.props.onListDragEnter}></div>
        <div className="remove-player"><i className="fa fa-rotate-left"></i> Remove Player
          <div className="cover" onDragOver={UI.dropEffect}
            onDragEnter={this.props.onRemoveDragEnter}
            onDragLeave={this.props.onRemoveDragLeave}>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = PlayersPanel;
