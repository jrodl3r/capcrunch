'use strict';

require('setimmediate');

var UI = require('../../ui.js'),
    TimerMixin  = require('react-timer-mixin');

var SharePanel = React.createClass({

  mixins: [TimerMixin],

  componentDidUpdate: function() {
    if (!$('#roster-name').val()) { $('#roster-name').val(this.props.shareData.name); }
  },

  saveRoster: function(e) {
    e.preventDefault();
    var name = document.getElementById('roster-name').value || this.props.shareData.name,
        type = 'basic'; // TODO: Add Text-Roster-Type (basic|full|markdown)
    document.getElementById('share-button').className = 'clicked';
    this.props.shareRoster(name, type);
    this.setTimeout(() => {
      document.getElementById('share-button').className = '';
    }, 1000);
  },

  checkRosterNameInput: function(e) {
    var str = e.target.value,
        key = String.fromCharCode(e.charCode);
    // letters/numbers + block enter key + single-dash/underscore/space
    if (!/\w|-|\s/.test(key) || e.charCode === 13) { return false; }
    else if (/\_|-|\s/.test(key) && /\_|-|\s/.test(str.substr(str.length - 1))) { return false; }
  },

  sharePopup: function(e) {
    e.preventDefault();
    var url   = encodeURIComponent(this.props.shareData.link),
        title = encodeURIComponent(document.title),
        type  = e.currentTarget.getAttribute('data-type'), h = 380, w = 560,
        lpos  = (window.screen.width/2) - ((w/2) + 10),
        tpos  = (window.screen.height/2) - ((h/2) + 50),
        setup = 'status=no,height=' + h + ',width=' + w + ',resizable=yes,left=' + lpos + ',top=' + tpos + ',screenX=' + lpos + ',screenY=' + tpos + ',toolbar=no,menubar=no,scrollbars=no,location=no,directories=no';
    if (type === 'fb') { var link = 'http://www.facebook.com/sharer.php?u=' + url + '&t=CapCrunch'; }
    else { var link = 'http://twitter.com/share?text=' + title + '%20%C2%BB&url=' + url + '&hashtags=capcrunch,nhl'; }
    window.open(link, 'sharer', setup);
    return false;
  },

  selectURL: function(e) {
    e.target.select();
  },

  closeShare: function(e) {
    e.preventDefault();
    this.props.resetShare();
  },

  render: function() {

    var pholder = this.props.shareData.name || this.props.teamName,
        title   = encodeURIComponent(document.title),
        url     = encodeURIComponent(this.props.shareData.link || document.location.origin),
        tw_link = 'http://twitter.com/share?text=' + title + '%20%C2%BB&url=' + url + '&hashtags=capcrunch,nhl',
        fb_link = 'http://www.facebook.com/sharer.php?u=' + url + '&t=CapCrunch';

    return (
      <div id="share">
        <form id="share-form" className={ this.props.shareData.view === 'input' ? 'active' : '' } onSubmit={this.saveRoster}>
          <input id="roster-name" type="text" spellCheck="false"
            placeholder={ pholder ? pholder : 'Roster Name' }
            onKeyPress={this.checkRosterNameInput} onPaste={UI.blockAction} />
          <button id="share-button" onClick={this.saveRoster}>Share</button>
        </form>
        <div id="share-dialog" className={ this.props.shareData.view === 'loading' || this.props.shareData.view === 'success' ? 'active' : '' }>
          <h3 id="share-loading" className={ this.props.shareData.view === 'loading' ? 'active' : '' }>
            <i className="fa fa-cog fa-spin"></i> Saving Roster
          </h3>
          <div id="share-confirm" className={ this.props.shareData.view === 'success' ? 'active' : '' }>
            <a id="share-close" onClick={this.closeShare}><i className="fa fa-close"></i></a>
            <a id="share-link" target="_blank" href={this.props.shareData.link}><i className="fa fa-link"></i></a>
            <h3>Show off your GM skills...</h3>
            <p>Share your roster with friends for the win.</p>
            <input id="share-url" type="text" value={this.props.shareData.link} onClick={this.selectURL} readOnly />
            <a id="twitter-share" href={tw_link} data-type="tw" onClick={this.sharePopup} target="_blank">
              <i className="fa fa-twitter"></i> Share on Twitter</a>
            <a id="facebook-share" href={fb_link} data-type="fb" onClick={this.sharePopup} target="_blank">
              <i className="fa fa-facebook"></i> Share on Facebook</a>
            <a id="text-share" data-clip={this.props.shareData.text}>
              <i className="fa fa-pencil"></i><span className="copy-label">Copy text-only roster to clipboard</span></a>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SharePanel;