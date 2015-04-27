// CapCrunch Roster (Component)
// ==================================================
'use strict';

var hotspot = '';

var Roster = React.createClass({
    playerTile: function(grid_id) {
      var playerData  = this.props.rosterData[grid_id],
          playerState = this.props.dragging ? 'clicked' : 'hover';

      return (
        <div id={grid_id}
          className={ this.props.rosterData[grid_id].status !== 'empty' ? 'tile active' : 'tile' }
          data-state={ this.props.rosterData[grid_id].status !== 'empty' ? 'active' : '' }
          onDragEnter={this.props.onTileDragEnter}
          onDragLeave={this.props.onTileDragLeave}>
      { playerData.status !== 'empty'
        ? <div draggable="true"
            className={ this.props.curDragPlayer.id === playerData.id  ? 'player active ' + playerState : 'player active' }
            onMouseOut={this.props.onPlayerMouseOut}
            onMouseOver={this.props.onPlayerMouseOver}
            onMouseDown={this.props.onPlayerMouseDown}
            onMouseUp={this.props.onPlayerMouseUp}
            onDragStart={this.props.onPlayerDragStart}
            onDragEnd={this.props.onPlayerDragEnd}
            onContextMenu={this.blockRightClick}>
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
                  ? <div className="benched">PB</div>
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
    blockRightClick: function(e) {
      e.preventDefault();
      return false;
    },
    hidePlayerBench: function() {
      var menu = document.getElementById('menu');
      menu.className = menu.className.replace(' show-bench', '');
    },
    onGridDragOver: function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    },
    onTriggerDragEnter: function(e) {
      var target, el = e.currentTarget, id = el.className;
      hotspot = id;
      el.className = el.className + ' hover';
      setTimeout(function() {
        if (id.indexOf('disabled') === -1 && hotspot === id) {
          target = document.getElementById(id);
          target.className = target.className + ' active';
          el.className = el.className + ' disabled';
        }
      }, 200);
    },
    onTriggerDragLeave: function(e) {
      var el = e.currentTarget;
      hotspot = '';
      if (el.className.indexOf('hover') !== -1) {
        el.className = el.className.replace(' hover', '');
      }
    },

    render: function() {
      return (
        <div id="roster" className="section active"
          onMouseUp={this.hidePlayerBench}
          onDragEnter={this.props.onGridDragEnter}
          onDragOver={this.onGridDragOver}>
          <div id="roster-stats" className={ this.props.activePlayers.length ? 'cap-stats active' : 'cap-stats' }>
            <div id="rcap-player-count" className="section">
              <span>Roster Players <span className="value">{this.props.activePlayers.length}</span></span>
            </div>
            <div id="rcap-payroll-total" className="section">
              <span>Payroll Total <span className="value">{this.props.rosterInfo.hit}</span></span>
            </div>
            <div id="rcap-cap-space" className="section">
              <span>Cap Space <span className={ this.props.rosterInfo.space > 0 ? 'value' : 'value overage' }>{this.props.rosterInfo.space}</span></span>
            </div>
            <div id="rcap-salary-cap" className="section salary-cap">
              <span>Salary Cap <span className="value">{this.props.leagueData.cap}</span></span>
            </div>
            <a id="roster-stats-button" className={ this.props.activePlayers.length ? 'cap-stats-menu-button' : 'cap-stats-menu-button disabled' }>
              <i className="fa fa-gear"></i>
            </a>
            <div id="roster-stats-menu" className={ this.props.activePlayers.length ? 'cap-stats-menu' : 'cap-stats-menu disabled' }>
              <ul>
                <li>
                  <a onClick={this.props.clearRosterData}><i className="fa fa-trash"></i> Remove All</a>
                </li>
              </ul>
            </div>
          </div>
          <div id="forwards" className="grid">
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
              <div id="FP" className="line pb">
                <div className="left">
                  {this.playerTile('FP1')}
                </div>
                <div className="center">
                  {this.playerTile('FP2')}
                </div>
                <div className="right">
                  {this.playerTile('FP3')}
                </div>
                <div className="title">PB</div>
              </div>
              <div id="FI" className="line ir">
                <div className="left">
                  {this.playerTile('FI1')}
                </div>
                <div className="center">
                  {this.playerTile('FI2')}
                </div>
                <div className="right">
                  {this.playerTile('FI3')}
                </div>
                <div className="title">IR</div>
              </div>
              <ul id="forwards-grid-nav" className="grid-nav">
                <li id="FP-trigger" className="FP" onDragEnter={this.onTriggerDragEnter} onDragLeave={this.onTriggerDragLeave}>PB</li>
                <li id="FI-trigger" className="FI" onDragEnter={this.onTriggerDragEnter} onDragLeave={this.onTriggerDragLeave}>IR</li>
              </ul>
            </div>
          </div>
          <div id="defense" className="grid defense">
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
              <div id="DP" className="line pb">
                <div className="left">
                  {this.playerTile('DP1')}
                </div>
                <div className="right">
                  {this.playerTile('DP2')}
                </div>
                <div className="title">PB</div>
              </div>
              <div id="DI" className="line ir">
                <div className="left">
                  {this.playerTile('DI1')}
                </div>
                <div className="right">
                  {this.playerTile('DI2')}
                </div>
                <div className="title">IR</div>
              </div>
              <ul id="defense-grid-nav" className="grid-nav">
                <li id="DP-trigger" className="DP" onDragEnter={this.onTriggerDragEnter} onDragLeave={this.onTriggerDragLeave}>PB</li>
                <li id="DI-trigger" className="DI" onDragEnter={this.onTriggerDragEnter} onDragLeave={this.onTriggerDragLeave}>IR</li>
              </ul>
            </div>
          </div>
          <div id="goalies" className="grid defense">
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
              <div id="GI" className="line ir">
                <div className="left">
                  {this.playerTile('GI1')}
                </div>
                <div className="right">
                  {this.playerTile('GI2')}
                </div>
                <div className="title">IR</div>
              </div>
              <ul id="goalies-grid-nav" className="grid-nav">
                <li id="GI-trigger" className="GI" onDragEnter={this.onTriggerDragEnter} onDragLeave={this.onTriggerDragLeave}>IR</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }
  });

module.exports = Roster;
