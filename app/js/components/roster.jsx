// CapCrunch Roster (Component)
// ==================================================
'use strict';

var PlayerItem = React.createClass({
  blockDrag: function(e) {
    e.preventDefault();
    e.stopPropagation();
  },
  render: function() {
    var playerData = this.props.playerData;
    return (
      <div className={ playerData.id ? 'player active' : 'player' }
        draggable={true}
        onMouseOut={this.props.handlePlayerMouseOut}
        onMouseOver={this.props.handlePlayerMouseOver}
        onMouseDown={this.props.handlePlayerMouseDown}
        onMouseUp={this.props.handlePlayerMouseUp}
        onDragStart={this.props.handlePlayerDragStart}
        onDragEnd={this.props.handlePlayerDragEnd}>
    { playerData.id
      ? <div className="inner">
          <div className="photo">
            <img src={ playerData.image ? playerData.image : 'http://img.capcrunch.io/players/default.png' }/>
          </div>
          <div className="info">
            <div className="name">
              <span className="jersey">{playerData.jersey}</span>
              {playerData.firstname.charAt(0)}. {playerData.lastname}
            </div>
            <div className="shot">{playerData.shot}</div>
            <div className="salary">{playerData.contract[0]}</div>
          </div>
          <div className="handle"></div>
          <div className="cover"></div>
        </div>
      : <div className="empty"></div> }
      </div>
    );
  }
});

var Roster = React.createClass({
    render: function() {
      return (
        <div id="roster" className="section active" onDragEnter={this.props.onGridDragEnter}>
          <div id="stats">Cap Stats</div>
          <div id="forwards" className="panel group">
            <div className="title">
              <div className="left">LW</div>
              <div className="center">C</div>
              <div className="right">RW</div>
            </div>
            <div className="inner">
              <div id="F1" className="line">
                <div className="left">
                  <div id="F1L" className="tile" data-state=""
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      playerData={this.props.rosterData.F1L}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="center">
                  <div id="F1C" className="tile" data-state=""
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      playerData={this.props.rosterData.F1C}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="right">
                  <div id="F1R" className="tile" data-state=""
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      playerData={this.props.rosterData.F1R}
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
                  <div id="F2L" className="tile" data-state=""
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      playerData={this.props.rosterData.F2L}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="center">
                  <div id="F2C" className="tile" data-state=""
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      playerData={this.props.rosterData.F2C}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="right">
                  <div id="F2R" className="tile" data-state=""
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      playerData={this.props.rosterData.F2R}
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
                  <div id="F3L" className="tile" data-state=""
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      playerData={this.props.rosterData.F3L}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="center">
                  <div id="F3C" className="tile" data-state=""
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      playerData={this.props.rosterData.F3C}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="right">
                  <div id="F3R" className="tile" data-state=""
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      playerData={this.props.rosterData.F3R}
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
                  <div id="F4L" className="tile" data-state=""
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      playerData={this.props.rosterData.F4L}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="center">
                  <div id="F4C" className="tile" data-state=""
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      playerData={this.props.rosterData.F4C}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="right">
                  <div id="F4R" className="tile" data-state=""
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      playerData={this.props.rosterData.F4R}
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
          <div id="defense" className="panel group defense">
            <div className="title">
              <div className="left">LD</div>
              <div className="right">RD</div>
            </div>
            <div className="inner">
              <div id="D1" className="line">
                <div className="left">
                  <div id="D1L" className="tile" data-state=""
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      playerData={this.props.rosterData.D1L}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="right">
                  <div id="D1R" className="tile" data-state=""
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      playerData={this.props.rosterData.D1R}
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
                  <div id="D2L" className="tile" data-state=""
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      playerData={this.props.rosterData.D2L}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="right">
                  <div id="D2R" className="tile" data-state=""
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      playerData={this.props.rosterData.D2R}
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
                  <div id="D3L" className="tile" data-state=""
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      playerData={this.props.rosterData.D3L}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="right">
                  <div id="D3R" className="tile" data-state=""
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      playerData={this.props.rosterData.D3R}
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
          <div id="goalies" className="panel group defense">
            <div className="title">G</div>
            <div className="inner">
              <div id="G1" className="line">
                <div className="left">
                  <div id="G1L" className="tile" data-state=""
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      playerData={this.props.rosterData.G1L}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="title goalie starter">S</div>
                <div className="right">
                  <div id="G1R" className="tile" data-state=""
                    onDragEnter={this.props.onTileDragEnter}
                    onDragLeave={this.props.onTileDragLeave}>
                    <PlayerItem
                      playerData={this.props.rosterData.G1R}
                      handlePlayerMouseOut={this.props.onPlayerMouseOut}
                      handlePlayerMouseOver={this.props.onPlayerMouseOver}
                      handlePlayerMouseDown={this.props.onPlayerMouseDown}
                      handlePlayerMouseUp={this.props.onPlayerMouseUp}
                      handlePlayerDragStart={this.props.onPlayerDragStart}
                      handlePlayerDragEnd={this.props.onPlayerDragEnd} />
                  </div>
                </div>
                <div className="title goalie">B</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  });

module.exports = Roster;
