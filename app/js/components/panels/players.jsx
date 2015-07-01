'use strict';

var UI = require('../../ui.js');

var PlayersPanel = React.createClass({

  buildPlayerList: function(players, group) {
    var list = players.map(function(player, i) {
      if (!/(inplay|ir|benched)/.test(player.status) && !/(queued|traded)/.test(player.action)) {
        return (
          <li key={ i + player.id } className="row">
            <div className="item" data-group={group} data-index={i} data-pos={player.position} draggable="true"
              onMouseEnter={this.props.onItemMouseEnter}
              onMouseLeave={this.props.onItemMouseLeave}
              onMouseDown={this.props.onItemMouseDown}
              onMouseUp={this.props.onItemMouseUp}
              onDragStart={this.props.onItemDragStart}
              onDragEnd={this.props.onItemDragEnd}
              onClick={this.blockAction}>
              <div className="inner">
                <div className="jersey">{player.jersey}</div>
                <div className="name">{player.lastname}<span>, </span>{player.firstname}</div>
                { group !== 'goaltenders' ? <div className="info"><span className="shot">{player.shot}</span>
                { group !== 'defensemen' ? <span className="position">{ player.shot ? '/' + player.position : player.position }</span> : null }
                </div> : null }
                <div className="handle"></div>
            { /(UFA|RFA)/.test(player.contract[this.props.year])
              ? <div className="salary agent">{player.contract[this.props.year]}</div>
              : <div className="salary">{player.capnum}</div> }
                <div className="status">
                { player.action === 'acquired' ? <div className="tag acquired">A</div> : null }
                { player.status === 'injured' ? <div className="tag injured">IR</div> : null }
                { group === 'created' ? <div className="tag created">C</div> : null }
                { player.prev_contract && !/(UFA|RFA)/.test(player.contract[this.props.year]) ? <div className="tag signed">S</div> : null }
                </div>
              </div>
            </div>
          </li>
        );
      } else if (/(inplay|ir|benched)/.test(player.status) || player.action === 'queued') {
        return <li key={ i + player.id } className="row inplay"></li>;
      } else {
        return (
          <li key={ i + player.id } className="row traded">
            <div className="item" data-group={group} data-index={i}>
              <div className="jersey">{player.jersey}</div>
              <div className="name">{player.lastname}<span>, </span>{player.firstname}</div>
              { group !== 'goaltenders' ? <div className="info"><span className="shot">{player.shot}</span>
              { group !== 'defensemen' ? <span className="position">{ player.shot ? '/' + player.position : player.position }</span> : null }
              </div> : null }
              <div className="handle"></div>
          { /(UFA|RFA)/.test(player.contract[this.props.year])
            ? <div className="salary agent">{player.contract[this.props.year]}</div>
            : <div className="salary">{player.capnum}</div> }
              <div className="status"><div className="tag traded">T</div></div>
            </div>
          </li>
        );
      }
    }.bind(this));
    return list;
  },

  blockAction: function (e) {
    e.preventDefault();
  },

  render: function() {
    var panelType = /(inactive|prospects)/.test(this.props.view) ? 'inactive' : 'active';

    return (
      <div id={this.props.panelId} className={ this.props.panelData[panelType] === this.props.view ? 'active player-list panel' : 'player-list panel' }>
      { this.props.playerData.length
        ? <div className="inner">
            <ul>{this.buildPlayerList(this.props.playerData, this.props.playerType)}</ul>
          </div> : null }
      </div>
    );
  }
});
// { this.props.playerType === 'inactive' && this.props.createdData
// ? <ul>{ this.props.createdData.length && this.props.createdData[0].team === this.props.activeTeam
//         ? this.buildPlayerList(this.props.createdData, 'created') : null }
//       {this.buildPlayerList(this.props.playerData, this.props.playerType)}</ul>
// : <ul>{this.buildPlayerList(this.props.playerData, this.props.playerType)}</ul> }
module.exports = PlayersPanel;
