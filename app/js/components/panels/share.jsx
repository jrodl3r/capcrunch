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
      var placeholder = this.props.rosterInfo.name || this.props.teamName;
      return (
        <div id="share">
          <form id="share-form" className="active" onSubmit={this.props.handleRosterSubmit}>
            <input id="roster-name" type="text"
              placeholder={ placeholder ? placeholder : 'Roster Name' }
              onKeyPress={this.checkRosterNameInput}
              onChange={this.changeRosterName}
              onPaste={this.blockPaste} />
            <button onClick={this.props.handleRosterSubmit}>Share</button>
          </form>
          <div id="share-dialog">
            <h3 id="share-loading" className="active"><i className="fa fa-cog fa-spin"></i> Saving Roster</h3>
            <div id="share-confirm">
              <h3>Show off your GM skills...</h3>
              <p>Share your roster with friends for the win.</p>
              <input id="roster-url" type="text" value={this.props.rosterInfo.link} readOnly />
              <button id="twitter-share"><i className="fa fa-twitter"></i> Share on Twitter</button>
              <button id="facebook-share"><i className="fa fa-facebook"></i> Share on Facebook</button>
              <a id="roster-link" target="_blank" href={this.props.rosterInfo.link}><i className="fa fa-link"></i></a>
            </div>
          </div>
        </div>
      );
    }
});

module.exports = SharePanel;
