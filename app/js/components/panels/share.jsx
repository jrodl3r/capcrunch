// CapCrunch Share Roster Panel (Roster Menu)
// ==================================================
'use strict';

var SharePanel = React.createClass({
    render: function() {
      return (
        <div id="share">
          <input id="roster-name" type="text" placeholder={this.props.teamName ? this.props.teamName : 'Roster Name'} />
          <button>Share</button>
        </div>
      );
    }
});

module.exports = SharePanel;
