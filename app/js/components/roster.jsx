// CapCrunch Roster (Component)
// ==================================================
'use strict';

var PlayerItem = React.createClass({
  render: function() {
    var playerData = this.props.playerData;

    return (
      <div className={ playerData.state !== 'empty' ? 'player active' : 'player'}>
    { playerData.state !== 'empty'
      ? <div className="inner">
          <div className="photo">
            <img src={ playerData.image ? playerData.image : 'http://img.capcrunch.io/players/default.png' }/>
          </div>
          <div className="info">
            <div className="name">{playerData.firstname.charAt(0)}. {playerData.lastname}</div>
            <div className="shot">{playerData.shot}</div>
            <div className="salary">{playerData.contract}</div>
          </div>
        </div>
      : <div className="empty"></div> }
      </div>
    );
  }
});

var Roster = React.createClass({
    handleDragEnter: function(e) {
      this.props.onDragEnter(e);
    },
    handleDragLeave: function(e) {
      this.props.onDragLeave(e);
    },
    render: function() {
      return (
        <div id="roster" className="section active">
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
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave}>
                    <PlayerItem playerData={this.props.rosterData.F1L} />
                  </div>
                </div>
                <div className="center">
                  <div id="F1C" className="tile" data-state=""
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave}>
                    <PlayerItem playerData={this.props.rosterData.F1C} />
                  </div>
                </div>
                <div className="right">
                  <div id="F1R" className="tile" data-state=""
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave}>
                    <PlayerItem playerData={this.props.rosterData.F1R} />
                  </div>
                </div>
                <div className="title">L1</div>
              </div>
              <div id="F2" className="line">
                <div className="left">
                  <div id="F2L" className="tile" data-state=""
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave}>
                    <PlayerItem playerData={this.props.rosterData.F2L} />
                  </div>
                </div>
                <div className="center">
                  <div id="F2C" className="tile" data-state=""
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave}>
                    <PlayerItem playerData={this.props.rosterData.F2C} />
                  </div>
                </div>
                <div className="right">
                  <div id="F2R" className="tile" data-state=""
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave}>
                    <PlayerItem playerData={this.props.rosterData.F2R} />
                  </div>
                </div>
                <div className="title">L2</div>
              </div>
              <div id="F3" className="line">
                <div className="left">
                  <div id="F3L" className="tile" data-state=""
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave}>
                    <PlayerItem playerData={this.props.rosterData.F3L} />
                  </div>
                </div>
                <div className="center">
                  <div id="F3C" className="tile" data-state=""
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave}>
                    <PlayerItem playerData={this.props.rosterData.F3C} />
                  </div>
                </div>
                <div className="right">
                  <div id="F3R" className="tile" data-state=""
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave}>
                    <PlayerItem playerData={this.props.rosterData.F3R} />
                  </div>
                </div>
                <div className="title">L3</div>
              </div>
              <div id="F4" className="line">
                <div className="left">
                  <div id="F4L" className="tile" data-state=""
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave}>
                    <PlayerItem playerData={this.props.rosterData.F4L} />
                  </div>
                </div>
                <div className="center">
                  <div id="F4C" className="tile" data-state=""
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave}>
                    <PlayerItem playerData={this.props.rosterData.F4C} />
                  </div>
                </div>
                <div className="right">
                  <div id="F4R" className="tile" data-state=""
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave}>
                    <PlayerItem playerData={this.props.rosterData.F4R} />
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
                  <div className="tile">
                    <!-- Left Defender-->
                  </div>
                </div>
                <div className="right">
                  <div className="tile">
                    <!-- Right Defender-->
                  </div>
                </div>
                <div className="title">P1</div>
              </div>
              <div id="D2" className="line">
                <div className="left">
                  <div className="tile">
                    <!-- Left Defender-->
                  </div>
                </div>
                <div className="right">
                  <div className="tile">
                    <!-- Right Defender-->
                  </div>
                </div>
                <div className="title">P2</div>
              </div>
              <div id="D3" className="line">
                <div className="left">
                  <div className="tile">
                    <!-- Left Defender-->
                  </div>
                </div>
                <div className="right">
                  <div className="tile">
                    <!-- Right Defender-->
                  </div>
                </div>
                <div className="title">P3</div>
              </div>
            </div>
          </div>
          <div id="goalies-group" className="panel group defense">
            <div className="title">G</div>
            <div className="inner">
              <div id="G1" className="line">
                <div className="left">
                  <div className="tile">
                    <!-- Starting Goaltender-->
                  </div>
                </div>
                <div className="title goalie starter">S</div>
                <div className="right">
                  <div className="tile">
                    <!-- Backup Goaltender-->
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
