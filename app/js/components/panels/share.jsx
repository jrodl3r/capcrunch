'use strict';

var UI  = require('../../ui.js');

var SharePanel = React.createClass({

  saveRoster: function(e) {
    e.preventDefault();
    var name = document.getElementById('roster-name').value || this.props.shareData.name || this.props.teamName;
    document.getElementById('share-button').className = 'clicked';
    this.props.saveRoster(name);
  },

  checkRosterNameInput: function(e) {
    var str = e.target.value,
        key = String.fromCharCode(e.charCode);
    // letters/numbers + block enter key + single-dash/underscore/space
    if (!/\w|-|\s/.test(key) || e.charCode === 13) { return false; }
    else if (/\_|-|\s/.test(key) && /\_|-|\s/.test(str.substr(str.length - 1))) { return false; }
  },

  shareTwitter: function(e) {
    e.preventDefault();
    // TODO
  },

  shareFacebook: function(e) {
    e.preventDefault();
    // TODO
  },

  showTextRoster: function(e) {
    e.preventDefault();
    // TODO
  },

  closeShare: function(e) {
    e.preventDefault();
    document.getElementById('share-button').className = '';
    this.props.resetShare();
  },

  render: function() {

    var shareView = this.props.shareData.view,
        shareLink = this.props.shareData.link,
        placeholder = this.props.shareData.name || this.props.teamName;

    return (
      <div id="share">
        <form id="share-form" className={ shareView === 'input' ? 'active' : '' } onSubmit={this.saveRoster}>
          <input id="roster-name" type="text"
            placeholder={ placeholder ? placeholder : 'Roster Name' }
            onKeyPress={this.checkRosterNameInput}
            onPaste={UI.blockAction} />
          <button id="share-button" onClick={this.saveRoster}>Share</button>
        </form>
        <div id="share-dialog" className={ shareView === 'loading' || shareView === 'success' ? 'active' : '' }>
          <h3 id="share-loading" className={ shareView === 'loading' ? 'active' : '' }>
            <i className="fa fa-cog fa-spin"></i> Saving Roster
          </h3>
          <div id="share-confirm" className={ shareView === 'success' ? 'active' : '' }>
            <a id="share-close" onClick={this.closeShare}><i className="fa fa-close"></i></a>
            <a id="share-link" target="_blank" href={shareLink}><i className="fa fa-link"></i></a>
            <h3>Show off your GM skills...</h3>
            <p>Share your roster with friends for the win.</p>
            <input id="share-url" type="text" value={shareLink} readOnly />
            <button id="twitter-share" onClick={this.shareTwitter}><i className="fa fa-twitter"></i> Share on Twitter</button>
            <button id="facebook-share" onClick={this.shareFacebook}><i className="fa fa-facebook"></i> Share on Facebook</button>
            <a id="text-roster" onClick={this.showTextRoster}><i className="fa fa-pencil"></i>text-only version</a>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SharePanel;
