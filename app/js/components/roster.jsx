// Roster Grid
// ==================================================
'use strict';

var CapStats = require('./capstats.jsx'),
    UI       = require('../ui.js');

var Roster = React.createClass({
    onGridDragOver: function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    },
    onPlayerMouseOver: function(e) {
      if (e.currentTarget.parentNode.dataset.state === 'active') {
        e.currentTarget.className = 'player active hover';
      }
    },
    onPlayerMouseOut: function(e) {
      if (e.currentTarget.parentNode.dataset.state === 'active') {
        e.currentTarget.className = 'player active';
      }
    },
    hideRemovePlayer: function() {
      var menu = document.getElementById('menu');
      menu.className = menu.className.replace(' show-remove-player', '');
    },
    playerTile: function(grid_id) {
      var playerData  = this.props.rosterData[grid_id],
          playerState = this.props.dragData.state ? 'clicked' : 'hover';

      return (
        <div id={grid_id}
          className={ this.props.rosterData[grid_id].status !== 'empty' ? 'tile active' : 'tile' }
          data-state={ this.props.rosterData[grid_id].status !== 'empty' ? 'active' : '' }
          onDragEnter={this.props.onTileDragEnter}
          onDragLeave={this.props.onTileDragLeave}
          onDragOver={this.onGridDragOver}>
      { playerData.status !== 'empty'
        ? <div draggable="true"
            className={ this.props.dragData.player.id === playerData.id  ? 'player active ' + playerState : 'player active' }
            onMouseOut={this.onPlayerMouseOut}
            onMouseOver={this.onPlayerMouseOver}
            onMouseDown={this.props.onPlayerMouseDown}
            onMouseUp={this.props.onPlayerMouseUp}
            onDragStart={this.props.onPlayerDragStart}
            onDragEnd={this.props.onPlayerDragEnd}
            onContextMenu={UI.blockClick}>
            <div className={playerData.team + ' inner'}>
              <div className="photo">
                <img src={ playerData.image ? playerData.image : 'http://img.capcrunch.io/players/default.png' }/>
              </div>
              <div className="info">
            { playerData.firstname
              ? <div className="name">
                  {playerData.firstname.charAt(0)}. {playerData.lastname}
                </div>
              : <div className="name">{playerData.lastname}</div> }
                <div className="jersey">{ playerData.jersey ? playerData.jersey : null }</div>
                <div className="shot">{ playerData.shot ? playerData.shot : null }</div>
                <div className="salary">{playerData.contract[0]}</div>
                <div className="status">
                { playerData.actions && playerData.actions.indexOf('acquired') !== -1
                  ? <div className="acquired">A</div>
                  : null }
                { playerData.actions && playerData.actions.indexOf('created') !== -1
                  ? <div className="created">C</div>
                  : null }
                { playerData.actions && playerData.actions.indexOf('injured') !== -1
                  ? <div className="injured">IR</div>
                  : null }
                { playerData.actions && playerData.actions.indexOf('benched') !== -1
                  ? <div className="benched">B</div>
                  : null }
                </div>
              </div>
              <div className="handle"></div>
              <div className="cover"></div>
            </div>
          </div>
        : <div className="player">
            <div className="empty"></div>
          </div> }
        </div>
      );
    },

    render: function() {
      var dragging = this.props.dragData.state,
          dragG    = this.props.dragData.type === 'goaltenders' || this.props.dragData.player.position === 'G' ? true : false,
          dragD    = this.props.dragData.type === 'defensemen' || this.props.dragData.player.position === 'D' ? true : false,
          dragF    = !dragG && !dragD ? true : false;

      return (
        <div id="roster" className="section active"
          onMouseUp={this.hideRemovePlayer}
          onDragEnter={this.props.onGridDragEnter}>
          <CapStats activeView="roster"
            playerCount={this.props.activePlayers.length}
            teamInfo={this.props.rosterInfo}
            cap={this.props.leagueData.cap}
            clearRosterData={this.props.clearRosterData} />
          <div id="forwards" className={ dragging && dragF ? 'grid dragging' : 'grid' }>
            <div className="title">
              <div className="left">LW</div>
              <div className="center">C</div>
              <div className="right">RW</div>
            </div>
            <div className="inner">
              <div id="F1" className="line">
                <div className="left">
                  {this.playerTile('F1L')}
                </div>
                <div className="center">
                  {this.playerTile('F1C')}
                </div>
                <div className="right">
                  {this.playerTile('F1R')}
                </div>
                <div className="title">L1</div>
              </div>
              <div id="F2" className="line">
                <div className="left">
                  {this.playerTile('F2L')}
                </div>
                <div className="center">
                  {this.playerTile('F2C')}
                </div>
                <div className="right">
                  {this.playerTile('F2R')}
                </div>
                <div className="title">L2</div>
              </div>
              <div id="F3" className="line">
                <div className="left">
                  {this.playerTile('F3L')}
                </div>
                <div className="center">
                  {this.playerTile('F3C')}
                </div>
                <div className="right">
                  {this.playerTile('F3R')}
                </div>
                <div className="title">L3</div>
              </div>
              <div id="F4" className="line">
                <div className="left">
                  {this.playerTile('F4L')}
                </div>
                <div className="center">
                  {this.playerTile('F4C')}
                </div>
                <div className="right">
                  {this.playerTile('F4R')}
                </div>
                <div className="title">L4</div>
              </div>
              <div id="FR" className="line ir">
                <div className="left">
                  {this.playerTile('FR1')}
                </div>
                <div className="center">
                  {this.playerTile('FR2')}
                </div>
                <div className="right">
                  {this.playerTile('FR3')}
                </div>
                <div className="title">IR</div>
              </div>
              <div id="FB" className="line bench">
                <div className="left">
                  {this.playerTile('FB1')}
                </div>
                <div className="center">
                  {this.playerTile('FB2')}
                </div>
                <div className="right">
                  {this.playerTile('FB3')}
                </div>
                <div className="title">BN</div>
              </div>
              <ul id="forwards-grid-nav" className="grid-nav">
                <li id="FB-trigger" className="FB"
                  onDragEnter={this.props.onTriggerDragEnter}
                  onDragLeave={this.props.onTriggerDragLeave}>BN</li>
                <li id="FR-trigger" className="FR"
                  onDragEnter={this.props.onTriggerDragEnter}
                  onDragLeave={this.props.onTriggerDragLeave}>IR</li>
              </ul>
            </div>
          </div>
          <div id="defense" className={ dragging && dragD ? 'grid defense dragging' : 'grid defense' }>
            <div className="title">
              <div className="left">LD</div>
              <div className="right">RD</div>
            </div>
            <div className="inner">
              <div id="D1" className="line">
                <div className="left">
                  {this.playerTile('D1L')}
                </div>
                <div className="right">
                  {this.playerTile('D1R')}
                </div>
                <div className="title">P1</div>
              </div>
              <div id="D2" className="line">
                <div className="left">
                  {this.playerTile('D2L')}
                </div>
                <div className="right">
                  {this.playerTile('D2R')}
                </div>
                <div className="title">P2</div>
              </div>
              <div id="D3" className="line">
                <div className="left">
                  {this.playerTile('D3L')}
                </div>
                <div className="right">
                  {this.playerTile('D3R')}
                </div>
                <div className="title">P3</div>
              </div>
              <div id="DR" className="line ir">
                <div className="left">
                  {this.playerTile('DR1')}
                </div>
                <div className="right">
                  {this.playerTile('DR2')}
                </div>
                <div className="title">IR</div>
              </div>
              <div id="DB" className="line bench">
                <div className="left">
                  {this.playerTile('DB1')}
                </div>
                <div className="right">
                  {this.playerTile('DB2')}
                </div>
                <div className="title">BN</div>
              </div>
              <ul id="defense-grid-nav" className="grid-nav">
                <li id="DB-trigger" className="DB"
                  onDragEnter={this.props.onTriggerDragEnter}
                  onDragLeave={this.props.onTriggerDragLeave}>BN</li>
                <li id="DR-trigger" className="DR"
                  onDragEnter={this.props.onTriggerDragEnter}
                  onDragLeave={this.props.onTriggerDragLeave}>IR</li>
              </ul>
            </div>
          </div>
          <div id="goalies" className={ dragging && dragG ? 'grid defense dragging' : 'grid defense' }>
            <div className="title">G</div>
            <div className="inner">
              <div id="G1" className="line">
                <div className="left">
                  {this.playerTile('G1L')}
                </div>
                <div className="right">
                  {this.playerTile('G1R')}
                </div>
                <div className="title goalie">T1</div>
              </div>
              <div id="GR" className="line ir">
                <div className="left">
                  {this.playerTile('GR1')}
                </div>
                <div className="right">
                  {this.playerTile('GR2')}
                </div>
                <div className="title">IR</div>
              </div>
              <div id="GB" className="line bench">
                <div className="left">
                  {this.playerTile('GB1')}
                </div>
                <div className="right">
                  {this.playerTile('GB2')}
                </div>
                <div className="title">BN</div>
              </div>
              <ul id="goalies-grid-nav" className="grid-nav">
                <li id="GB-trigger" className="GB"
                  onDragEnter={this.props.onTriggerDragEnter}
                  onDragLeave={this.props.onTriggerDragLeave}>BN</li>
                <li id="GR-trigger" className="GR"
                  onDragEnter={this.props.onTriggerDragEnter}
                  onDragLeave={this.props.onTriggerDragLeave}>IR</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }
  });

module.exports = Roster;
