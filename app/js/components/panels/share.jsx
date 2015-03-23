// CapCrunch Share Panel (Roster Menu)
// ==================================================
'use strict';

var SharePanel = React.createClass({
    render: function() {
      return (
        <div id="share">
          <input type="text" placeholder={this.props.teamData.name ? this.props.teamData.name : 'Roster Name'} />
          <button>Share</button>
        </div>
      );
    }
});

module.exports = SharePanel;
