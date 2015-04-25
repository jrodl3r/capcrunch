// CapCrunch Roster (Component)
// ==================================================
'use strict';

var PlayerItem = React.createClass({
  blockRightClick: function(e) {
    e.preventDefault();
    return false;
  },

  render: function() {
    var playerData = this.props.playerData;
    if (playerData.status !== 'empty') {
      if (this.props.dragging) {
        return (
          <div draggable={true}
            className={ this.props.curDragPlayer.id === playerData.id  ? 'player active clicked' : 'player active' }
            onMouseOut={this.props.handlePlayerMouseOut}
            onMouseOver={this.props.handlePlayerMouseOver}
            onMouseDown={this.props.handlePlayerMouseDown}
            onMouseUp={this.props.handlePlayerMouseUp}
            onDragStart={this.props.handlePlayerDragStart}
            onDragEnd={this.props.handlePlayerDragEnd}
            onContextMenu={this.blockRightClick}>
        { playerData.id
          ? <div className={playerData.team + ' inner'}>
              <div className="photo">
                <img src={ playerData.image ? playerData.image : 'http://img.capcrunch.io/players/default.png' }/>
              </div>
              <div className="info">
            { playerData.firstname
              ? <div className="name">
                  {playerData.firstname.charAt(0)}. {playerData.lastname}
                </div>
              : <div className="name">{playerData.lastname}</div> }
                <div className="jersey">{ playerData.jersey ? playerData.jersey : ' ' }</div>
                <div className="shot">{ playerData.shot ? playerData.shot : ' ' }</div>
                <div className="salary">{playerData.contract[0]}</div>
                <div className="status">
                { playerData.actions && playerData.actions.indexOf('acquired') !== -1
                  ? <div className="acquired">A</div>
                  : null }
                { playerData.actions && playerData.actions.indexOf('created') !== -1
                  ? <div className="created">C</div>
                  : null }
                </div>
              </div>
              <div className="handle"></div>
              <div className="cover"></div>
            </div>
          : <div className="empty"></div> }
          </div>
        );
      } else {
        return (
          <div draggable={true}
            className={ this.props.curDragPlayer.id === playerData.id  ? 'player active hover' : 'player active' }
            onMouseOut={this.props.handlePlayerMouseOut}
            onMouseOver={this.props.handlePlayerMouseOver}
            onMouseDown={this.props.handlePlayerMouseDown}
            onMouseUp={this.props.handlePlayerMouseUp}
            onDragStart={this.props.handlePlayerDragStart}
            onDragEnd={this.props.handlePlayerDragEnd}
            onContextMenu={this.blockRightClick}>
        { playerData.id
          ? <div className={playerData.team + ' inner'}>
              <div className="photo">
                <img src={ playerData.image ? playerData.image : 'http://img.capcrunch.io/players/default.png' }/>
              </div>
              <div className="info">
            { playerData.firstname
              ? <div className="name">
                  {playerData.firstname.charAt(0).toUpperCase()}. {playerData.lastname.charAt(0).toUpperCase() + playerData.lastname.slice(1)}
                </div>
              : <div className="name">{playerData.lastname.charAt(0).toUpperCase() + playerData.lastname.slice(1)}</div> }
                <div className="jersey">{ playerData.jersey ? playerData.jersey : ' ' }</div>
                <div className="shot">{ playerData.shot ? playerData.shot : ' ' }</div>
                <div className="salary">{playerData.contract[0]}</div>
                <div className="status">
              { playerData.actions && playerData.actions.indexOf('acquired') !== -1
                ? <div className="acquired">A</div>
                : null }
              { playerData.actions && playerData.actions.indexOf('created') !== -1
                ? <div className="created">C</div>
                : null }
                </div>
              </div>
              <div className="handle"></div>
              <div className="cover"></div>
            </div>
          : <div className="empty"></div> }
          </div>
        );
      }
    } else {
      return (
        <div className="player">
          <div className="empty"></div>
        </div>
      );
    }
  }
});

var Roster = React.createClass({
    onGridDragOver: function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    },

    render: function() {
      return (
        <div id="roster" className="section active" onDragEnter={this.props.onGridDragEnter} onDragOver={this.onGridDragOver}>
          <div id="roster-stats" className={ this.props.activePlayers.length ? 'cap-stats active' : 'cap-stats' }>
            <div id="rcap-player-count" className="section">
              <span>Roster Players <span className="value">{this.props.activePlayers.length}</span></span>
            </div>
            <div id="rcap-payroll-total" className="section">
              <span>Payroll Total <span className="value">{this.props.rosterInfo.hit}</span></span>
            </div>
            <div id="rcap-cap-space" className="section">
              <span>Cap Space <span className="value">{this.props.rosterInfo.space}</span></span>
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
                  <div id="F1L"
                    className={ this.props.rosterData.F1L.status !== 'empty' ? 'tile active' : 'tile' }
                    data-state={ this.props.rosterData.F1L.status !== 'empty' ? 'active' : '' }
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      dragging={this.props.dragging}
                      playerData={this.props.rosterData.F1L}
                      curDragPlayer={this.props.curDragPlayer}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="center">
                  <div id="F1C"
                    className={ this.props.rosterData.F1C.status !== 'empty' ? 'tile active' : 'tile' }
                    data-state={ this.props.rosterData.F1C.status !== 'empty' ? 'active' : '' }
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      dragging={this.props.dragging}
                      playerData={this.props.rosterData.F1C}
                      curDragPlayer={this.props.curDragPlayer}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="right">
                  <div id="F1R"
                    className={ this.props.rosterData.F1R.status !== 'empty' ? 'tile active' : 'tile' }
                    data-state={ this.props.rosterData.F1R.status !== 'empty' ? 'active' : '' }
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      dragging={this.props.dragging}
                      playerData={this.props.rosterData.F1R}
                      curDragPlayer={this.props.curDragPlayer}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="title">L1</div>
              </div>
              <div id="F2" className="line">
                <div className="left">
                  <div id="F2L"
                    className={ this.props.rosterData.F2L.status !== 'empty' ? 'tile active' : 'tile' }
                    data-state={ this.props.rosterData.F2L.status !== 'empty' ? 'active' : '' }
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      dragging={this.props.dragging}
                      playerData={this.props.rosterData.F2L}
                      curDragPlayer={this.props.curDragPlayer}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="center">
                  <div id="F2C"
                    className={ this.props.rosterData.F2C.status !== 'empty' ? 'tile active' : 'tile' }
                    data-state={ this.props.rosterData.F2C.status !== 'empty' ? 'active' : '' }
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      dragging={this.props.dragging}
                      playerData={this.props.rosterData.F2C}
                      curDragPlayer={this.props.curDragPlayer}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="right">
                  <div id="F2R"
                    className={ this.props.rosterData.F2R.status !== 'empty' ? 'tile active' : 'tile' }
                    data-state={ this.props.rosterData.F2R.status !== 'empty' ? 'active' : '' }
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      dragging={this.props.dragging}
                      playerData={this.props.rosterData.F2R}
                      curDragPlayer={this.props.curDragPlayer}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="title">L2</div>
              </div>
              <div id="F3" className="line">
                <div className="left">
                  <div id="F3L"
                    className={ this.props.rosterData.F3L.status !== 'empty' ? 'tile active' : 'tile' }
                    data-state={ this.props.rosterData.F3L.status !== 'empty' ? 'active' : '' }
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      dragging={this.props.dragging}
                      playerData={this.props.rosterData.F3L}
                      curDragPlayer={this.props.curDragPlayer}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="center">
                  <div id="F3C"
                    className={ this.props.rosterData.F3C.status !== 'empty' ? 'tile active' : 'tile' }
                    data-state={ this.props.rosterData.F3C.status !== 'empty' ? 'active' : '' }
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      dragging={this.props.dragging}
                      playerData={this.props.rosterData.F3C}
                      curDragPlayer={this.props.curDragPlayer}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="right">
                  <div id="F3R"
                    className={ this.props.rosterData.F3R.status !== 'empty' ? 'tile active' : 'tile' }
                    data-state={ this.props.rosterData.F3R.status !== 'empty' ? 'active' : '' }
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      dragging={this.props.dragging}
                      playerData={this.props.rosterData.F3R}
                      curDragPlayer={this.props.curDragPlayer}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="title">L3</div>
              </div>
              <div id="F4" className="line">
                <div className="left">
                  <div id="F4L"
                    className={ this.props.rosterData.F4L.status !== 'empty' ? 'tile active' : 'tile' }
                    data-state={ this.props.rosterData.F4L.status !== 'empty' ? 'active' : '' }
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      dragging={this.props.dragging}
                      playerData={this.props.rosterData.F4L}
                      curDragPlayer={this.props.curDragPlayer}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="center">
                  <div id="F4C"
                    className={ this.props.rosterData.F4C.status !== 'empty' ? 'tile active' : 'tile' }
                    data-state={ this.props.rosterData.F4C.status !== 'empty' ? 'active' : '' }
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      dragging={this.props.dragging}
                      playerData={this.props.rosterData.F4C}
                      curDragPlayer={this.props.curDragPlayer}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="right">
                  <div id="F4R"
                    className={ this.props.rosterData.F4R.status !== 'empty' ? 'tile active' : 'tile' }
                    data-state={ this.props.rosterData.F4R.status !== 'empty' ? 'active' : '' }
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      dragging={this.props.dragging}
                      playerData={this.props.rosterData.F4R}
                      curDragPlayer={this.props.curDragPlayer}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="title">L4</div>
              </div>
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
                  <div id="D1L"
                    className={ this.props.rosterData.D1L.status !== 'empty' ? 'tile active' : 'tile' }
                    data-state={ this.props.rosterData.D1L.status !== 'empty' ? 'active' : '' }
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      dragging={this.props.dragging}
                      playerData={this.props.rosterData.D1L}
                      curDragPlayer={this.props.curDragPlayer}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="right">
                  <div id="D1R"
                    className={ this.props.rosterData.D1R.status !== 'empty' ? 'tile active' : 'tile' }
                    data-state={ this.props.rosterData.D1R.status !== 'empty' ? 'active' : '' }
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      dragging={this.props.dragging}
                      playerData={this.props.rosterData.D1R}
                      curDragPlayer={this.props.curDragPlayer}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="title">P1</div>
              </div>
              <div id="D2" className="line">
                <div className="left">
                  <div id="D2L"
                    className={ this.props.rosterData.D2L.status !== 'empty' ? 'tile active' : 'tile' }
                    data-state={ this.props.rosterData.D2L.status !== 'empty' ? 'active' : '' }
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      dragging={this.props.dragging}
                      playerData={this.props.rosterData.D2L}
                      curDragPlayer={this.props.curDragPlayer}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="right">
                  <div id="D2R"
                    className={ this.props.rosterData.D2R.status !== 'empty' ? 'tile active' : 'tile' }
                    data-state={ this.props.rosterData.D2R.status !== 'empty' ? 'active' : '' }
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      dragging={this.props.dragging}
                      playerData={this.props.rosterData.D2R}
                      curDragPlayer={this.props.curDragPlayer}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="title">P2</div>
              </div>
              <div id="D3" className="line">
                <div className="left">
                  <div id="D3L"
                    className={ this.props.rosterData.D3L.status !== 'empty' ? 'tile active' : 'tile' }
                    data-state={ this.props.rosterData.D3L.status !== 'empty' ? 'active' : '' }
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      dragging={this.props.dragging}
                      playerData={this.props.rosterData.D3L}
                      curDragPlayer={this.props.curDragPlayer}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="right">
                  <div id="D3R"
                    className={ this.props.rosterData.D3R.status !== 'empty' ? 'tile active' : 'tile' }
                    data-state={ this.props.rosterData.D3R.status !== 'empty' ? 'active' : '' }
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      dragging={this.props.dragging}
                      playerData={this.props.rosterData.D3R}
                      curDragPlayer={this.props.curDragPlayer}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="title">P3</div>
              </div>
            </div>
          </div>
          <div id="goalies" className="grid defense">
            <div className="title">G</div>
            <div className="inner">
              <div id="G1" className="line">
                <div className="left">
                  <div id="G1L"
                    className={ this.props.rosterData.G1L.status !== 'empty' ? 'tile active' : 'tile' }
                    data-state={ this.props.rosterData.G1L.status !== 'empty' ? 'active' : '' }
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      dragging={this.props.dragging}
                      playerData={this.props.rosterData.G1L}
                      curDragPlayer={this.props.curDragPlayer}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="right">
                  <div id="G1R"
                    className={ this.props.rosterData.G1R.status !== 'empty' ? 'tile active' : 'tile' }
                    data-state={ this.props.rosterData.G1R.status !== 'empty' ? 'active' : '' }
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      dragging={this.props.dragging}
                      playerData={this.props.rosterData.G1R}
                      curDragPlayer={this.props.curDragPlayer}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="title goalie">T1</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  });

module.exports = Roster;
