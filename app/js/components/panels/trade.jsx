// CapCrunch Trade Player Panel (Roster Menu)
// ==================================================
'use strict';

var TradePanel = React.createClass({
    render: function() {
      return (
        <div id="trades" className="panel inactive">
          <div className="title">Trades</div>
          <div className="inner">
            <p>[Trade Control]</p>
          </div>
        </div>
      );
    }
});

module.exports = TradePanel;
