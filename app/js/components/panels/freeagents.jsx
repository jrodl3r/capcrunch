'use strict';

var FreeAgents = React.createClass({

  render: function() {

    return (
      <div id="freeagents" className={ this.props.activeTab === 'freeagents' ? 'tab-area active' : 'tab-area' }>
        <div className="inner"></div>
      </div>
    );
  }
});

module.exports = FreeAgents;
