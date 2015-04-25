// CapCrunch Create Player Tab (Transactions Panel)
// ==================================================
'use strict';

var CreatePlayer = React.createClass({
    getDefaultProps: function() {
      return {
        playerData  : { firstname : '', lastname : '', shot : '', position : '', jersey : '', salary : '', contract : [] },
        messages    : {
          heading        : 'Create & Sign custom players to your team:',
          missing_fname  : 'Don\'t forget to add a first name...',
          missing_lname  : 'Don\'t forget to add a last name...',
          missing_pos    : 'Don\'t forget to choose a position...',
          missing_salary : 'Don\'t forget to add a salary...',
          missing_dur    : 'Don\'t forget to add a salary duration...'
        }
      };
    },
    handleCreatePlayer: function() {
      var playerData = this.props.playerData;
      if (playerData.lastname && playerData.position && playerData.salary >= 0.001 && playerData.contract.length) {
        playerData.firstname = playerData.firstname ? playerData.firstname.trim() : '';
        playerData.lastname = playerData.lastname.trim();
        this.props.handleCreatePlayer(playerData);
        this.props.playerData.firstname = '';
        this.props.playerData.lastname = '';
        this.props.playerData.shot = '';
        this.props.playerData.position = '';
        this.props.playerData.jersey = '';
        this.props.playerData.salary = '';
        this.props.playerData.contract = [];
        document.getElementById('create-player-confirm').className = 'transaction-confirm active';
        setTimeout(function() {
          document.getElementById('create-player-fname').value = '';
          document.getElementById('create-player-fname').className = '';
          document.getElementById('create-player-lname').value = '';
          document.getElementById('create-player-lname').className = '';
          document.getElementById('create-player-shot').className = '';
          document.getElementById('create-player-shot').selectedIndex = 0;
          document.getElementById('create-player-jersey').className = '';
          document.getElementById('create-player-jersey').value = '';
          document.getElementById('create-player-position').className = '';
          document.getElementById('create-player-position').selectedIndex = 0;
          document.getElementById('create-player-salary').value = '';
          document.getElementById('create-player-salary').className = '';
          document.getElementById('create-player-salary-duration').className = '';
          document.getElementById('create-player-salary-duration').selectedIndex = 0;
          document.getElementById('create-player-msg').innerText = this.props.messages.heading;
          document.getElementById('create-player-confirm').className = 'transaction-confirm';
        }.bind(this), 2000);
      } else if (!playerData.lastname) {
        document.getElementById('create-player-lname').className = 'missing';
        document.getElementById('create-player-lname').focus();
        document.getElementById('create-player-msg').innerText = this.props.messages.missing_lname;
        document.getElementById('create-player-msg').className = 'warning';
      } else if (!playerData.position) {
        document.getElementById('create-player-position').className = 'missing';
        document.getElementById('create-player-position').focus();
        document.getElementById('create-player-msg').innerText = this.props.messages.missing_pos;
        document.getElementById('create-player-msg').className = 'warning';
      } else if (!playerData.salary || playerData.salary < 0.001) {
        document.getElementById('create-player-salary').className = 'missing';
        document.getElementById('create-player-salary').focus();
        document.getElementById('create-player-msg').innerText = this.props.messages.missing_salary;
        document.getElementById('create-player-msg').className = 'warning';
      } else if (!playerData.contract.length) {
        document.getElementById('create-player-salary-duration').className = 'missing';
        document.getElementById('create-player-salary-duration').focus();
        document.getElementById('create-player-msg').innerText = this.props.messages.missing_dur;
        document.getElementById('create-player-msg').className = 'warning';
      }
    },
    checkPlayerNameInput: function(e) {
      var str = e.target.value,
          key = String.fromCharCode(e.charCode);
      // two-dots/dashes/spaces max-total
      if (str.match(/\./g) && str.match(/\./g).length > 1 && /\./.test(key)) { return false; }
      if (str.match(/\-/g) && str.match(/\-/g).length > 1 && /\-/.test(key)) { return false; }
      if (str.match(/\s/g) && str.match(/\s/g).length > 1 && /\s/.test(key)) { return false; }
      // letters/dashes/spaces/dots + block enter key + single-dash/dot
      else if (!/[a-zA-Z]|-|\s|\./.test(key) || e.charCode === 13) { return false; }
      else if (/-|\./.test(key) && /-|\.|\s/.test(str.substr(str.length - 1))) { return false; }
      // single-space (following letters/dots)
      else if (/\s/.test(key) && /-|\s/.test(str.substr(str.length - 1))) { return false; }
      // starts with letter
      else if (str.length === 0 && !/[a-zA-Z]/.test(key)) { return false; }
    },
    changePlayerFirstName: function(e) {
      this.props.playerData.firstname = e.target.value;
      e.target.className = 'active';
    },
    changePlayerLastName: function(e) {
      this.props.playerData.lastname = e.target.value;
      e.target.className = 'active';
    },
    formatFirstName: function(e) {
      if (e.target.value === ' ' || e.target.value === '-' || e.target.value === '.') {
        e.target.value = '';
      } else {
        e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
      }
      this.props.playerData.firstname = e.target.value;
    },
    formatLastName: function(e) {
      if (e.target.value === ' ' || e.target.value === '-' || e.target.value === '.') {
        e.target.value = '';
      } else {
        e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
      }
      this.props.playerData.lastname = e.target.value;
    },
    changePlayerShot: function(e) {
      this.props.playerData.shot = e.target.value;
      e.target.className = 'active';
    },
    changePlayerPosition: function(e) {
      this.props.playerData.position = e.target.value;
      e.target.className = 'active';
    },
    changePlayerJersey: function(e) {
      this.props.playerData.jersey = e.target.value;
      e.target.className = 'active';
    },
    checkPlayerJerseyInput: function(e) {
      var str = e.target.value,
          key = String.fromCharCode(e.charCode),
          sel = window.getSelection().toString();
      // allow text-selection overwrite
      if (sel && str.indexOf(sel) > -1 && /\d/.test(key)) { return true; }
      // numbers only + block enter key + two-digit max-length
      if (!/\d/.test(key) || e.charCode === 13 || str.length === 2) { return false; }
    },
    changePlayerSalary: function(e) {
      if (e.target.value > 0) {
        this.props.playerData.salary = parseFloat(e.target.value).toFixed(3);
        e.target.className = 'active';
      }
    },
    checkPlayerSalaryInput: function(e) {
      var str = e.target.value,
          key = String.fromCharCode(e.charCode),
          sel = window.getSelection().toString();
      // allow text-selection overwrite
      if (sel && str.indexOf(sel) > -1 && /\d/.test(key)) { return true; }
      // numbers/single-dot only + block enter key + six-digit max-length
      if (!/\d|\./.test(key) || e.charCode === 13 || str.length === 6) { return false; }
      // starts with digit
      else if (str.length === 0 && !/\d/.test(key)) { return false; }
      // single-dot only
      else if (/\./.test(key) && str.indexOf('.') > -1) { return false; }
      // leading-zero must preceed dot
      else if (str.length === 1 && str === '0' && !/\./.test(key)) { return false; }
      // max of 99 million
      else if (str.length === 2 && /\d{2}/.test(str) && !/\./.test(key)) { return false; }
      // prevent 4 decimal-places on single-digit millions
      else if (str.length === 5 && /\d{1}\.\d{3}/.test(str)) { return false; }
    },
    formatSalary: function(e) {
      if (e.target.value === '' || e.target.value === '0') {
        e.target.value = parseFloat('0.1').toFixed(3);
        e.target.className = 'active';
        this.props.playerData.salary = parseFloat('0.1').toFixed(3);
      } else {
        var str = e.target.value;
        e.target.value = parseFloat(str).toFixed(3);
      }
    },
    changePlayerSalaryDuration: function(e) {
      var duration = parseInt(e.target.value);
      this.props.playerData.contract = [];
      for (var i = 0; i < duration; i++) {
        this.props.playerData.contract[i] = this.props.playerData.salary;
      }
      e.target.className = 'active';
    },
    blockPaste: function() {
      return false;
    },

    render: function() {
      return (
        <div id="createplayer" className="tab-area">
          <div className="inner">
            <p id="create-player-msg">{this.props.messages.heading}</p>
            <input id="create-player-fname" type="text" placeholder="First Name"
              onKeyPress={this.checkPlayerNameInput}
              onChange={this.changePlayerFirstName}
              onBlur={this.formatFirstName}
              onPaste={this.blockPaste} />
            <input id="create-player-lname" type="text" placeholder="Last Name"
              onKeyPress={this.checkPlayerNameInput}
              onChange={this.changePlayerLastName}
              onBlur={this.formatLastName}
              onPaste={this.blockPaste} />
            <select id="create-player-shot" defaultValue="0" onChange={this.changePlayerShot}>
              <option value="0" disabled>Shot</option>
              <option value="L">L</option>
              <option value="R">R</option>
            </select>
            <select id="create-player-position" defaultValue="0" onChange={this.changePlayerPosition}>
              <option value="0" disabled>Position</option>
              <option value="LW">LW</option>
              <option value="C">C</option>
              <option value="RW">RW</option>
              <option value="D">D</option>
              <option value="G">G</option>
            </select>
            <input id="create-player-jersey" type="number" placeholder="Jersey" min="0" max="99"
              onKeyPress={this.checkPlayerJerseyInput}
              onChange={this.changePlayerJersey}
              onPaste={this.blockPaste} />
            <input id="create-player-salary" type="number" step="0.100" min="0.100" max="99.999" placeholder="Salary"
              onKeyPress={this.checkPlayerSalaryInput}
              onChange={this.changePlayerSalary}
              onBlur={this.formatSalary}
              onPaste={this.blockPaste} />
            <select id="create-player-salary-duration" defaultValue="0" onChange={this.changePlayerSalaryDuration}>
              <option value="0" disabled>Duration</option>
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="4">4 years</option>
              <option value="5">5 years</option>
            </select>
            <!--<a id="create-player-add-salary" className="add-button" title="Add Salary"><i className="fa fa-plus"></i></a>-->
            <button id="create-player-button" onClick={this.handleCreatePlayer}>
              Create &amp; Sign Player
            </button>
            <div id="create-player-confirm" className="transaction-confirm">
              Player Created <i className="fa fa-magic"></i>
            </div>
          </div>
        </div>
      );
    }
});

module.exports = CreatePlayer;
