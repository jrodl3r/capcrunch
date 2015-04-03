// CapCrunch Share Roster Panel (Roster Menu)
// ==================================================
'use strict';

var SharePanel = React.createClass({
    changeRosterName: function(e) {
      this.props.rosterInfo.name = e.target.value;
    },
    checkRosterNameInput: function(e) {
      var str = e.target.value,
          key = String.fromCharCode(e.charCode);
      // letters/numbers + block enter key + single-dash/underscore/space
      if (!/\w|-|\s/.test(key) || e.charCode === 13) { return false; }
      else if (/\_|-|\s/.test(key) && /\_|-|\s/.test(str.substr(str.length - 1))) { return false; }
    },
    blockPaste: function() {
      return false;
    },
    render: function() {
      var placeholder = this.props.rosterInfo.name || this.props.teamData.name;
      return (
        <div id="share">
          <form onSubmit={this.props.handleRosterSubmit}>
            <input id="roster-name" type="text"
              placeholder={ placeholder ? placeholder : 'Roster Name' }
              onKeyPress={this.checkRosterNameInput}
              onChange={this.changeRosterName}
              onPaste={this.blockPaste} />
            <button onClick={this.props.handleRosterSubmit}>Share</button>
          </form>
        </div>
      );
    }
});

module.exports = SharePanel;
