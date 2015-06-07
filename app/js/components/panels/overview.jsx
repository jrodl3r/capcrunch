'use strict';

var UI  = require('../../ui.js');

var GMPanel = React.createClass({

  render: function() {

    return (
      <div id="overview" className="panel">
        <div className="title">GM Overview
          <a onClick={UI.togglePanelView}><i className="fa fa-chevron-up"></i></a>
        </div>
      { this.props.trades.length || this.props.injured.length || this.props.benched.length || this.props.created.length || this.props.unsigned
        ? <div>
            { this.props.unsigned
              ? <div>Unsigned Players</div>
              : null }
            { this.props.created.length
              ? <div>Created Players</div>
              : null }
            { this.props.trades.length
              ? <div>Trades List</div>
              : null }
            { this.props.injured.length
              ? <div>Injured List</div>
              : null }
            { this.props.benched.length
              ? <div>Benched List</div>
              : null }
          </div>
        : <div className="inner no-action">Nothing to report...</div> }
      </div>
    );
  }
});

module.exports = GMPanel;
