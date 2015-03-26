// CapCrunch Roster (Component)
// ==================================================
'use strict';

var Roster = React.createClass({
    handleDragEnter: function(e) {
      this.props.onDragEnter(e);
    },
    handleDragLeave: function(e) {
      this.props.onDragLeave(e);
    },
    handleDrop: function(e) {
      this.props.onDropItem(e);
    },
    render: function() {
      var rosterPlayer = (
        <div className="player">
          <div className="photo">
            <img src="http://img.capcrunch.io/players/Ennis-Tyler.png" />
          </div>
          <div className="info">
            <div className="name">Tyler Ennis</div>
            <div className="shot">L</div>
            <div className="salary">9.999</div>
          </div>
        </div>
      );

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
                  <div id="F11" className="tile" data-state="open"
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave}
                    onDrop={this.handleDrop}>
                  </div>
                </div>
                <div className="center">
                  <div id="F12" className="tile" data-state="open"
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave}
                    onDrop={this.handleDrop}>
                  </div>
                </div>
                <div className="right">
                  <div id="F13" className="tile" data-state="open"
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave}
                    onDrop={this.handleDrop}>
                  </div>
                </div>
                <div className="title">L1</div>
              </div>
              <div id="F2" className="line">
                <div className="left">
                  <div className="tile">
                    <!-- Left Winger-->
                  </div>
                </div>
                <div className="center">
                  <div className="tile">
                    <!-- Center-->
                  </div>
                </div>
                <div className="right">
                  <div className="tile">
                    <!-- Right Winger-->
                  </div>
                </div>
                <div className="title">L2</div>
              </div>
              <div id="F3" className="line">
                <div className="left">
                  <div className="tile">
                    <!-- Left Winger-->
                  </div>
                </div>
                <div className="center">
                  <div className="tile">
                    <!-- Center-->
                  </div>
                </div>
                <div className="right">
                  <div className="tile">
                    <!-- Right Winger-->
                  </div>
                </div>
                <div className="title">L3</div>
              </div>
              <div id="F4" className="line">
                <div className="left">
                  <div className="tile">
                    <!-- Left Winger-->
                  </div>
                </div>
                <div className="center">
                  <div className="tile">
                    <!-- Center-->
                  </div>
                </div>
                <div className="right">
                  <div className="tile">
                    <!-- Right Winger-->
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
