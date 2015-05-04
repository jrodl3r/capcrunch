// CapCrunch Free Agents Tab (Transactions Panel)
// ==================================================
'use strict';

var FreeAgents = React.createClass({
    render: function() {
      var tab = this.props.activeTab;

      return (
        <div id="freeagents" className={ tab === 'freeagents' ? 'tab-area active' : 'tab-area' }>
          <div className="inner"></div>
        </div>
      );
    }
});

module.exports = FreeAgents;
