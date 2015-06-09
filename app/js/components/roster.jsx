'use strict';

var CapStats = require('./capstats.jsx'),
    UI       = require('../ui.js');//,
    //PRM      = React.addons.PureRenderMixin;

var Roster = React.createClass({

  //mixins: [PRM],

  playerTile: function(id) {
    var player = this.props.rosterData[id], altLine, salary;
    if (player.status !== 'empty') {
      altLine = /(ir|benched)/.test(player.status);
      salary = player.contract[this.props.capData.year];
      return (
        <div id={id} className="tile active"
          onDragEnter={this.props.onTileDragEnter}
          onDragLeave={this.props.onTileDragLeave}>
          <div id={player.id} data-group={player.group} data-index={player.index} className="player active hover" draggable="true"
            onMouseEnter={this.props.onPlayerMouseEnter}
            onMouseLeave={this.props.onPlayerMouseLeave}
            onMouseDown={this.props.onPlayerMouseDown}
            onMouseUp={this.props.onPlayerMouseUp}
            onDragStart={this.props.onPlayerDragStart}
            onDragEnd={this.props.onPlayerDragEnd}>
            <div className="inner">
              { !altLine ? <img height="48" width="48" src={ player.image ? 'http://s3.amazonaws.com/capcrunch/img/players/' + player.image : 'http://s3.amazonaws.com/capcrunch/img/default.png' }/> : null }
              <div className="info">
                <div className="jersey">{player.jersey}</div>
                <div className="name">{player.firstname.charAt(0)}. {player.lastname}</div>
            { !altLine
              ? <div className="salary">
                { !/(UFA|RFA)/.test(salary) ? <span>{player.capnum}</span> : <span className={salary}>{salary}</span> }
                </div> : null }
                <div className="status">
                  { player.status === 'ir' ? <div className="tag injured">IR</div> : null }
                  { player.status === 'benched' ? <div className="tag benched">B</div> : null }
                  { player.action === 'created' ? <div className="tag created">C</div> : null }
                  { player.action === 'acquired' ? <div className="tag acquired">A</div> : null }
                  { player.position !== 'G' ? <span className="shot">{player.shot}</span> : null }
                </div>
            { altLine
              ? <div className="salary">
                { !/(UFA|RFA)/.test(salary) ? <span>{player.capnum}</span> : <span className={salary}>{salary}</span> }
                </div> : null }
              </div>
              <div className="handle"></div>
            </div>
            <div className="bg"><div className={ player.team + ' logo' }></div></div>
          </div>
        </div>
      );
    } else {
      return (
        <div id={id} className="tile"
          onDragOver={UI.dropEffect}
          onDragEnter={this.props.onTileDragEnter}
          onDragLeave={this.props.onTileDragLeave}>
          <div className="player">
            <div className="empty"></div>
          </div>
        </div>
      );
    }
  },

  render: function() {

    var dragGroup = this.props.dragData.group,
        dragIndex = this.props.dragData.index;
    if (dragIndex) {
      if (dragGroup === 'inactive' || dragGroup === 'created') {
        dragGroup = dragGroup === 'inactive'
          ? this.props.teamData.players[dragGroup][dragIndex].position
          : this.props.playerData.created[dragIndex].position;
        if (dragGroup === 'G') { dragGroup = 'goaltenders'; }
        else if (dragGroup === 'D') { dragGroup = 'defensemen'; }
        else { dragGroup = 'forwards'; }
      }
    }

    return (
      <div id="roster"
        className={ this.props.activeView === 'roster' ? 'section active' : 'section' }
        onDragEnter={this.props.onGridDragEnter}>
        <CapStats activeView="roster" capData={this.props.capData} />
        <div id="forwards" className="grid">
          <div className="header">
            <div className="left">LW</div>
            <div className="center">C</div>
            <div className="right">RW</div>
          </div>
          <div className={ dragGroup === 'forwards' ? 'inner dragging' : 'inner' }>
            <div id="F1" className="line">
              <div className="left">{this.playerTile('F1L')}</div>
              <div className="center">{this.playerTile('F1C')}</div>
              <div className="right">{this.playerTile('F1R')}</div>
              <div className="title">L1</div>
            </div>
            <div id="F2" className="line">
              <div className="left">{this.playerTile('F2L')}</div>
              <div className="center">{this.playerTile('F2C')}</div>
              <div className="right">{this.playerTile('F2R')}</div>
              <div className="title">L2</div>
            </div>
            <div id="F3" className="line">
              <div className="left">{this.playerTile('F3L')}</div>
              <div className="center">{this.playerTile('F3C')}</div>
              <div className="right">{this.playerTile('F3R')}</div>
              <div className="title">L3</div>
            </div>
            <div id="F4" className="line">
              <div className="left">{this.playerTile('F4L')}</div>
              <div className="center">{this.playerTile('F4C')}</div>
              <div className="right">{this.playerTile('F4R')}</div>
              <div className="title">L4</div>
            </div>
            <div id="FB" className="line bench">
              <div className="left">{this.playerTile('FB1')}</div>
              <div className="center">{this.playerTile('FB2')}</div>
              <div className="right">{this.playerTile('FB3')}</div>
              <div className="title">BN</div>
            </div>
            <div id="FR" className="line ir">
              <div className="left">{this.playerTile('FR1')}</div>
              <div className="center">{this.playerTile('FR2')}</div>
              <div className="right">{this.playerTile('FR3')}</div>
              <div className="title">IR</div>
            </div>
            <ul id="forwards-grid-nav" className="grid-nav">
              <li id="FR-trigger" className="" data-line="FR" onDragEnter={this.props.onTriggerDragEnter}>IR</li>
              <li id="FB-trigger" className="" data-line="FB" onDragEnter={this.props.onTriggerDragEnter}>BN</li>
            </ul>
          </div>
        </div>
        <div id="defense" className="grid">
          <div className="header">
            <div className="left">LD</div>
            <div className="right">RD</div>
          </div>
          <div className={ dragGroup === 'defensemen' ? 'inner dragging' : 'inner' }>
            <div id="D1" className="line">
              <div className="left">{this.playerTile('D1L')}</div>
              <div className="right">{this.playerTile('D1R')}</div>
              <div className="title">P1</div>
            </div>
            <div id="D2" className="line">
              <div className="left">{this.playerTile('D2L')}</div>
              <div className="right">{this.playerTile('D2R')}</div>
              <div className="title">P2</div>
            </div>
            <div id="D3" className="line">
              <div className="left">{this.playerTile('D3L')}</div>
              <div className="right">{this.playerTile('D3R')}</div>
              <div className="title">P3</div>
            </div>
            <div id="DB" className="line bench">
              <div className="left">{this.playerTile('DB1')}</div>
              <div className="right">{this.playerTile('DB2')}</div>
              <div className="title">BN</div>
            </div>
            <div id="DR" className="line ir">
              <div className="left">{this.playerTile('DR1')}</div>
              <div className="right">{this.playerTile('DR2')}</div>
              <div className="title">IR</div>
            </div>
            <ul id="defense-grid-nav" className="grid-nav">
              <li id="DR-trigger" className="" data-line="DR" onDragEnter={this.props.onTriggerDragEnter}>IR</li>
              <li id="DB-trigger" className="" data-line="DB" onDragEnter={this.props.onTriggerDragEnter}>BN</li>
            </ul>
          </div>
        </div>
        <div id="goalies" className="grid">
          <div className="header">G</div>
          <div className={ dragGroup === 'goaltenders' ? 'inner dragging' : 'inner' }>
            <div id="G1" className="line">
              <div className="left">{this.playerTile('G1L')}</div>
              <div className="right">{this.playerTile('G1R')}</div>
              <div className="title goalie">T1</div>
            </div>
            <div id="GB" className="line bench">
              <div className="left">{this.playerTile('GB1')}</div>
              <div className="right">{this.playerTile('GB2')}</div>
              <div className="title">BN</div>
            </div>
            <div id="GR" className="line ir">
              <div className="left">{this.playerTile('GR1')}</div>
              <div className="right">{this.playerTile('GR2')}</div>
              <div className="title">IR</div>
            </div>
            <ul id="goalies-grid-nav" className="grid-nav">
              <li id="GR-trigger" className="" data-line="GR" onDragEnter={this.props.onTriggerDragEnter}>IR</li>
              <li id="GB-trigger" className="" data-line="GB" onDragEnter={this.props.onTriggerDragEnter}>BN</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Roster;
