// CapCrunch Share Roster Panel (Roster Menu)
// ==================================================
'use strict';

var SharePanel = React.createClass({
    changeRosterName: function(e) {
      this.props.rosterInfo.name = e.target.value;
    },
    checkRosterNameInput: function(e) {
      var key = String.fromCharCode(e.charCode);
      // letters + numbers + single-spacing only
      if (!/\w|\s/.test(key)) {
        return false;
      }
      // TODO: Single-Space ONLY + Block Enter Key
      // TODO: Add Team Name value if not default
    },
    render: function() {
      var placeholder = this.props.rosterInfo.name || this.props.teamData.name;
      return (
        <div id="share">
          <form onSubmit={this.props.handleRosterSubmit}>
            <input id="roster-name" type="text"
              placeholder={ placeholder ? placeholder : 'Roster Name' }
              onKeyPress={this.checkRosterNameInput}
              onChange={this.changeRosterName} />
            <button onClick={this.props.handleRosterSubmit}>Share</button>
          </form>
        </div>
      );
    }
});

module.exports = SharePanel;
