'use strict';

var Messages = require('../../static/messages.js'),
    UI       = require('../../ui.js');

var created = { id : '', firstname : '', lastname : '', capnum: '', caphit: '', bonus: '', shot : '', position : '', jersey : '', salary : '', image : '', team : '', contract : ['','','','','','','','','','','','','','',''] };

var CreatePlayer = React.createClass({

  createPlayer: function() {
    var i;
    if (this.verifyInput()) {
      created.contract = ['','','','','','','','','','','','','','',''];
      for (i = 0; i < created.duration; i++) { created.contract[i + 6] = created.salary; }
      this.props.createPlayer(created);
      created = { id : '', firstname : '', lastname : '', capnum: '', caphit: '', bonus: '', shot : '', position : '', jersey : '', salary : '', image : '', team : '', contract : ['','','','','','','','','','','','','','',''] };
      UI.confirmAction('create');
    } else {
      if (!created.firstname) {
        UI.missingCreateInput('fname', Messages.create.missing_fname);
      } else if (!created.lastname) {
        UI.missingCreateInput('lname', Messages.create.missing_lname);
      } else if (created.position === '0') {
        UI.missingCreateInput('position', Messages.create.missing_pos);
      } else if (created.salary <= 0) {
        UI.missingCreateInput('salary', Messages.create.missing_salary);
      } else if (created.duration === '0') {
        UI.missingCreateInput('duration', Messages.create.missing_dur);
      }
    }
  },

  setInput: function() {
    created.firstname = document.getElementById('create-player-fname').value.trim();
    created.lastname = document.getElementById('create-player-lname').value.trim();
    created.position = document.getElementById('create-player-position').value;
    created.jersey = document.getElementById('create-player-jersey').value;
    created.shot = document.getElementById('create-player-shot').value !== '0' ? document.getElementById('create-player-shot').value : '';
    created.salary = document.getElementById('create-player-salary').value;
    created.duration = document.getElementById('create-player-duration').value;

  },

  verifyInput: function() {
    if (created.firstname && created.lastname && created.position !== 0 && created.salary > 0 && created.duration > 0) { return true; }
    return false;
  },

  changePlayerInput: function(e) {
    $(e.target).addClass('active');
    $(e.target).removeClass('missing');
    this.updateButton();
  },

  changePlayerSalary: function(e) {
    if (e.target.value > 0) { $(e.target).addClass('active'); }
    $(e.target).removeClass('missing');
    this.updateButton();
  },

  updateButton: function() {
    this.setInput();
    if (this.verifyInput()) { $('#create-player-button').addClass('enabled'); }
    else { $('#create-player-button').removeClass('enabled'); }
  },

  render: function() {
    var active = this.props.activeTab === 'createplayer';

    return (
      <div id="createplayer" className={ this.props.activeTab === 'createplayer' ? 'tab-area active' : 'tab-area' }>
        <div className="inner">
          <p id="create-player-msg">{Messages.create.heading}</p>
          <input id="create-player-fname" className="" type="text" placeholder="First Name" data-type="firstname" tabIndex={ active ? '100' : '-1' }
            onKeyPress={UI.checkPlayerNameInput}
            onChange={this.changePlayerInput}
            onBlur={UI.formatName}
            onPaste={UI.blockAction} />
          <input id="create-player-lname" className="" type="text" placeholder="Last Name" data-type="lastname" tabIndex={ active ? '101' : '-1' }
            onKeyPress={UI.checkPlayerNameInput}
            onChange={this.changePlayerInput}
            onBlur={UI.formatName}
            onPaste={UI.blockAction} />
          <select id="create-player-shot" className="" defaultValue="0" data-type="shot" tabIndex={ active ? '102' : '-1' } onChange={this.changePlayerInput}>
            <option value="0" disabled>Shot</option>
            <option value="L">L</option>
            <option value="R">R</option>
          </select>
          <select id="create-player-position" className="" defaultValue="0" data-type="position" tabIndex={ active ? '103' : '-1' } onChange={this.changePlayerInput}>
            <option value="0" disabled>Position</option>
            <option value="LW">LW</option>
            <option value="C">C</option>
            <option value="RW">RW</option>
            <option value="D">D</option>
            <option value="G">G</option>
          </select>
          <input id="create-player-jersey" className="" type="number" placeholder="Jersey" min="0" max="99" data-type="jersey" tabIndex={ active ? '104' : '-1' }
            onKeyPress={UI.checkPlayerJerseyInput}
            onChange={this.changePlayerInput}
            onPaste={UI.blockAction} />
          <input id="create-player-salary" className="" type="number" step="0.100" min="0.100" max="99.999" placeholder="Salary" tabIndex={ active ? '105' : '-1' }
            onKeyPress={UI.checkPlayerSalaryInput}
            onChange={this.changePlayerSalary}
            onBlur={UI.formatSalary}
            onPaste={UI.blockAction} />
          <select id="create-player-duration" className="" defaultValue="0" tabIndex={ active ? '106' : '-1' } onChange={this.changePlayerSalary}>
            <option value="0" disabled>Duration</option>
            <option value="1">1 year</option>
            <option value="2">2 years</option>
            <option value="3">3 years</option>
            <option value="4">4 years</option>
            <option value="5">5 years</option>
          </select>
          <button id="create-player-button" className="" tabIndex={ active ? '107' : '-1' } onClick={this.createPlayer}>Create &amp; Sign Player</button>
          <div id="create-player-confirm" className="transaction-confirm">Player Created <i className="fa fa-check"></i></div>
        </div>
      </div>
    );
  }
});

module.exports = CreatePlayer;
