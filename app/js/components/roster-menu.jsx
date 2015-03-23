// CapCrunch Roster Menu (Component)
// ==================================================
'use strict';

var SharePanel  = require('./panels/share.jsx'),
    TradePanel  = require('./panels/trade.jsx'),
    CreatePanel = require('./panels/create.jsx');

var RosterMenu = React.createClass({
    render: function() {
      return (
        <div id="menu" className="section active">
          <SharePanel teamData={this.props.teamData} />
          <div id="forwards-list" className="panel player-list">
            <div className="title">Forwards</div>
            <div className="inner">
              <div className="header">
                <div className="name">Player</div>
                <div className="shot">Shot</div>
                <div className="salary">Salary</div>
              </div>
              <ul>
              {this.props.teamData.players.forwards.map(function(forward) {
                if (forward.firstname) {
                  return (
                    <li className="row">
                      <div className="name">
                        <span className="jersey">{forward.jersey}</span>
                        {forward.lastname}, {forward.firstname}
                      </div>
                      <div className="shot">&nbsp;{forward.shot ? forward.shot : ''}&nbsp;</div>
                      <div className="salary">{forward.contract[0]}</div>
                    </li>
                  );
                } else {
                  return <li className="empty">Select Team<span className="arrow">&#10548;</span></li>;
                }
              })}
              </ul>
            </div>
          </div>
          <div id="defense-list" className="panel player-list">
            <div className="title">Defense</div>
            <div className="inner">
              <div className="header">
                <div className="name">Player</div>
                <div className="shot">Shot</div>
                <div className="salary">Salary</div>
              </div>
              <ul>
              {this.props.teamData.players.defensemen.map(function(defender) {
                if (defender.firstname) {
                  return (
                    <li className="row">
                      <div className="name">
                        <span className="jersey">{defender.jersey}</span>
                        {defender.lastname}, {defender.firstname}
                      </div>
                      <div className="shot">&nbsp;{defender.shot ? defender.shot : ''}&nbsp;</div>
                      <div className="salary">{defender.contract[0]}</div>
                    </li>
                  );
                } else {
                  return <li className="empty">Select Team<span className="arrow">&#10548;</span></li>;
                }
              })}
              </ul>
            </div>
          </div>
          <div id="goalies-list" className="panel short player-list">
            <div className="title">Goalies</div>
            <div className="inner">
              <div className="header">
                <div className="name">Player</div>
                <div className="shot">Shot</div>
                <div className="salary">Salary</div>
              </div>
              <ul>
              {this.props.teamData.players.goaltenders.map(function(player) {
                if (player.firstname) {
                  return (
                    <li className="row">
                      <div className="name">
                        <span className="jersey">{player.jersey}</span>
                        {player.lastname}, {player.firstname}
                      </div>
                      <div className="shot">&nbsp;{player.shot ? player.shot : ''}&nbsp;</div>
                      <div className="salary">{player.contract[0]}</div>
                    </li>
                  );
                } else {
                  return <li className="empty">Select Team<span className="arrow">&#10548;</span></li>;
                }
              })}
              </ul>
            </div>
          </div>
          <div id="inactive-list" className="panel player-list">
            <div className="title">Inactive</div>
            <div className="inner">
              <div className="header">
                <div className="name">Player</div>
                <div className="shot">Shot</div>
                <div className="salary">Salary</div>
              </div>
              <ul>
              {this.props.teamData.players.inactive.map(function(player) {
                if (player.firstname) {
                  return (
                    <li className="row">
                      <div className="name">
                        <span className="jersey">{player.jersey}</span>
                        {player.lastname}, {player.firstname}
                      </div>
                      <div className="shot">&nbsp;{player.shot ? player.shot : ''}&nbsp;</div>
                      <div className="salary">{player.contract[0]}</div>
                    </li>
                  );
                } else {
                  return <li className="empty">Select Team<span className="arrow">&#10548;</span></li>;
                }
              })}
              </ul>
            </div>
          </div>
          <TradePanel />
          <CreatePanel />
        </div>
      );
    }
  });

module.exports = RosterMenu;
