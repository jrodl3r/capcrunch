'use strict';

var Loading = React.createClass({

  render: function() {

    return (
      <div id="loading" className={ this.props.activeView === 'loading' ? 'active' : '' }>
        <i className="fa fa-cog fa-spin"></i> Loading
      </div>
    );
  }
});

module.exports = Loading;
