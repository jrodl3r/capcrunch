'use strict';

var Messages = require('../../static/messages.js'),
    UI       = require('../../ui.js');

var CreatePlayer = React.createClass({

  getInitialState: function() {
    return { playerData : { firstname : '', lastname : '', shot : '', position : '', jersey : '', salary : '', contract : [] } };
  },

  createPlayer: function() {
    var playerData = this.state.playerData;
    var updateData = { firstname : '', lastname : '', shot : '', position : '', jersey : '', salary : '', contract : [] };
    if (playerData.firstname && playerData.lastname && playerData.position && playerData.salary >= 0.001 && playerData.contract.length) {
      playerData.firstname = playerData.firstname.trim();
      playerData.lastname = playerData.lastname.trim();
      this.props.createPlayer(playerData);
      this.setState({ playerData : updateData });
      UI.confirmAction('create');
    } else {
      if (!playerData.firstname) {
        UI.missingCreateInput('fname', Messages.create.missing_fname);
      } else if (!playerData.lastname) {
        UI.missingCreateInput('lname', Messages.create.missing_lname);
      } else if (!playerData.position) {
        UI.missingCreateInput('position', Messages.create.missing_pos);
      } else if (!playerData.salary || playerData.salary < 0.001) {
        UI.missingCreateInput('salary', Messages.create.missing_salary);
      } else if (!playerData.contract.length) {
        UI.missingCreateInput('duration', Messages.create.missing_dur);
      }
    }
  },

  checkPlayerNameInput: function(e) {
    var str = e.target.value,
        key = String.fromCharCode(e.charCode);
    // two-dots/dashes/spaces max-total
    if (str.match(/\./g) && str.match(/\./g).length > 1 && /\./.test(key)) { e.preventDefault(); }
    if (str.match(/\-/g) && str.match(/\-/g).length > 1 && /\-/.test(key)) { e.preventDefault(); }
    if (str.match(/\s/g) && str.match(/\s/g).length > 1 && /\s/.test(key)) { e.preventDefault(); }
    // letters/dashes/spaces/dots + block enter key + single-dash/dot
    else if (!/[a-zA-Z]|-|\s|\./.test(key) || e.charCode === 13) { e.preventDefault(); }
    else if (/-|\./.test(key) && /-|\.|\s/.test(str.substr(str.length - 1))) { e.preventDefault(); }
    // single-space (following letters/dots)
    else if (/\s/.test(key) && /-|\s/.test(str.substr(str.length - 1))) { e.preventDefault(); }
    // starts with letter
    else if (str.length === 0 && !/[a-zA-Z]/.test(key)) { e.preventDefault(); }
  },

  formatName: function(e) {
    var playerData = this.state.playerData,
        value = e.target.value;
    if (value === ' ' || value === '-' || value === '.') { e.target.value = ''; }
    else { e.target.value = value.charAt(0).toUpperCase() + value.slice(1); }
    playerData[e.target.getAttribute('data-type')] = e.target.value;
    this.setState({ playerData : playerData });
  },

  checkPlayerJerseyInput: function(e) {
    var str = e.target.value,
        key = String.fromCharCode(e.charCode),
        sel = window.getSelection().toString();
    // allow text-selection overwrite
    if (sel && str.indexOf(sel) > -1 && /\d/.test(key)) { e.preventDefault(); }
    // numbers only + block enter key + two-digit max-length
    if (!/\d/.test(key) || e.charCode === 13 || str.length === 2) { e.preventDefault(); }
  },

  changePlayerSalary: function(e) {
    var playerData = this.state.playerData;
    if (e.target.value > 0) {
      e.target.className = 'active';
      playerData.salary = parseFloat(e.target.value).toFixed(3);
      this.setState({ playerData : playerData });
    }
  },

  checkPlayerSalaryInput: function(e) {
    var str = e.target.value,
        key = String.fromCharCode(e.charCode),
        sel = window.getSelection().toString();
    // allow text-selection overwrite
    if (sel && str.indexOf(sel) > -1 && /\d/.test(key)) { return true; }
    // numbers/single-dot only + block enter key + six-digit max-length
    if (!/\d|\./.test(key) || e.charCode === 13 || str.length === 6) { e.preventDefault(); }
    // starts with digit or dot
    else if (str.length === 0 && !/\d|\./.test(key)) { e.preventDefault(); }
    // single-dot only
    else if (/\./.test(key) && str.indexOf('.') > -1) { e.preventDefault(); }
    // leading-zero must preceed dot
    else if (str.length === 1 && str === '0' && !/\./.test(key)) { e.preventDefault(); }
    // max of 99 million
    else if (str.length === 2 && /\d{2}/.test(str) && !/\./.test(key)) { e.preventDefault(); }
    // prevent 4 decimal-places on single-digit millions
    else if (str.length === 5 && /\d{1}\.\d{3}/.test(str)) { e.preventDefault(); }
  },

  changePlayerSalaryDuration: function(e) {
    var duration = parseInt(e.target.value),
        playerData = this.state.playerData, i;
    playerData.contract = [];
    for (i = 0; i < duration; i++) {
      playerData.contract[i] = playerData.salary;
    }
    e.target.className = 'active';
    this.setState({ playerData : playerData });
  },

  formatSalary: function(e) {
    var playerData = this.state.playerData;
    var str = e.target.value;
    if (str === '' || str === '0') {
      e.target.value = '0.100';
      e.target.className = 'active';
      playerData.salary = '0.100';
    } else {
      playerData.salary = e.target.value = parseFloat(str).toFixed(3);
    }
    this.setState({ playerData : playerData });
  },

  changePlayerInput: function(e) {
    var playerData = this.state.playerData;
    e.target.className = 'active';
    playerData[e.currentTarget.getAttribute('data-type')] = e.target.value;
    this.setState({ playerData : playerData });
  },

  render: function() {
    // TODO: <a id="create-player-add-salary" className="add-button" title="Add Salary"><i className="fa fa-plus"></i></a>

    return (
      <div id="createplayer" className={ this.props.activeTab === 'createplayer' ? 'tab-area active' : 'tab-area' }>
        <div className="inner">
          <p id="create-player-msg">{Messages.create.heading}</p>
          <input id="create-player-fname" className="" type="text" placeholder="First Name" data-type="firstname"
            onKeyPress={this.checkPlayerNameInput}
            onChange={this.changePlayerInput}
            onBlur={this.formatName}
            onPaste={UI.blockAction} />
          <input id="create-player-lname" className="" type="text" placeholder="Last Name" data-type="lastname"
            onKeyPress={this.checkPlayerNameInput}
            onChange={this.changePlayerInput}
            onBlur={this.formatName}
            onPaste={UI.blockAction} />
          <select id="create-player-shot" className="" defaultValue="0" data-type="shot" onChange={this.changePlayerInput}>
            <option value="0" disabled>Shot</option>
            <option value="L">L</option>
            <option value="R">R</option>
          </select>
          <select id="create-player-position" className="" defaultValue="0" data-type="position" onChange={this.changePlayerInput}>
            <option value="0" disabled>Position</option>
            <option value="LW">LW</option>
            <option value="C">C</option>
            <option value="RW">RW</option>
            <option value="D">D</option>
            <option value="G">G</option>
          </select>
          <input id="create-player-jersey" className="" type="number" placeholder="Jersey" min="0" max="99" data-type="jersey"
            onKeyPress={this.checkPlayerJerseyInput}
            onChange={this.changePlayerInput}
            onPaste={UI.blockAction} />
          <input id="create-player-salary" className="" type="number" step="0.100" min="0.100" max="99.999" placeholder="Salary"
            onKeyPress={this.checkPlayerSalaryInput}
            onChange={this.changePlayerSalary}
            onBlur={this.formatSalary}
            onPaste={UI.blockAction} />
          <select id="create-player-duration" className="" defaultValue="0" onChange={this.changePlayerSalaryDuration}>
            <option value="0" disabled>Duration</option>
            <option value="1">1 year</option>
            <option value="2">2 years</option>
            <option value="3">3 years</option>
            <option value="4">4 years</option>
            <option value="5">5 years</option>
          </select>
          <button id="create-player-button" className="" onClick={this.createPlayer}>Create &amp; Sign Player</button>
          <div id="create-player-confirm" className="transaction-confirm">
            Player Created <i className="fa fa-magic"></i>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = CreatePlayer;
