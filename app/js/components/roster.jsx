// CapCrunch Roster (Component)
// ==================================================
'use strict';

var Roster = React.createClass({
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
              <div id="forwards-1" className="line">
                <div className="left">
                  <div className="tile">
                    <!-- Left Winger-->
                    <div className="player">
                      <div className="photo"><img src="img/players/ennis-tyler.png"/></div>
                      <div className="info">
                        <div className="name">Tyler Ennis
                          <div className="shot">L</div>
                        </div>
                        <div className="salary">9.999</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="center">
                  <div className="tile">
                    <!-- Center-->
                    <div className="player">
                      <div className="photo"><img src="img/players/girgensons-zemgus.png"/></div>
                      <div className="info">
                        <div className="name">Zemgus Girgensons
                          <div className="shot">R</div>
                        </div>
                        <div className="salary">9.999</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="right">
                  <div className="tile">
                    <!-- Right Winger-->
                    <div className="player">
                      <div className="photo"><img src="img/players/gionta-brian.png"/></div>
                      <div className="info">
                        <div className="name">Brian Gionta
                          <div className="shot">R</div>
                        </div>
                        <div className="salary">9.999</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="title">L1</div>
              </div>
              <div id="forwards-2" className="line">
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
              <div id="forwards-3" className="line">
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
              <div id="forwards-4" className="line">
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
              <div id="defense-1" className="line">
                <div className="left">
                  <div className="tile">
                    <!-- Left Defender-->
                    <div className="player">
                      <div className="photo"><img src="img/players/bogosian-zach.png"/></div>
                      <div className="info">
                        <div className="name">Zach Bogosian
                          <div className="shot">L</div>
                        </div>
                        <div className="salary">9.999</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="right">
                  <div className="tile">
                    <!-- Right Defender-->
                    <div className="player">
                      <div className="photo"><img src="img/players/ristolainen-rasmus.png"/></div>
                      <div className="info">
                        <div className="name">Rasmus Ristolainen
                          <div className="shot">R</div>
                        </div>
                        <div className="salary">9.999</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="title">P1</div>
              </div>
              <div id="defense-2" className="line">
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
              <div id="defense-3" className="line">
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
              <div id="goalie-1" className="line">
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
