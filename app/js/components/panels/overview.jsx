'use strict';

var GMPanel = React.createClass({

  listUnsigned: function() {
    return (
      <div>
        <div className="title">Unsigned Players</div>
        <div className="list">(unsigned.map)</div>
      </div>
    );
  },

  listCreated: function() {
    return (
      <div>
        <div className="group">Created Players</div>
        <ul className="list">
          { this.props.created.map(function(player, i) {
            return (
              <li key={i}>{player.firstname}</li>
            );
          }) }
        </ul>
      </div>
    );
  },

  listTrades: function() {
    return (
      <div>
        <div className="group">Trades</div>
        <ul className="list">
          { this.props.trades.map(function(trade, i) {
            return (
              <li key={i}>{trade} { i + 1 }</li>
            );
          }) }
        </ul>
      </div>
    );
  },

  render: function() {
    var active = this.props.created.length + this.props.trades.length + this.props.unsigned;

    return (
      <div id="overview" className={ active ? 'active panel' : 'panel' }>
        <div className="title">GM Overview</div>
        <div className="inner">
          { this.props.unsigned ? this.listUnsigned() : null }
          { this.props.created.length ? this.listCreated() : null }
          { this.props.trades.length ? this.listTrades() : null }
        </div>
      </div>
    );
  }
});

module.exports = GMPanel;
