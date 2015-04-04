// CapCrunch Create Player Tab (Transactions Panel)
// ==================================================
'use strict';

var CreatePlayer = React.createClass({
    getDefaultProps: function() {
      return {
        playerData : { firstname : '', lastname : '', shot : '', position : '', jersey : '', salary : '', contract : [] }
      };
    },
    handleCreatePlayer: function(e) {
      var playerData = this.props.playerData;
      if (playerData.firstname && playerData.lastname && playerData.position && playerData.salary && playerData.contract.length) {
        this.props.playerData.firstname = playerData.firstname.trim();
        this.props.playerData.lastname = playerData.lastname.trim();
        this.props.handleCreatePlayer(this.props.playerData);
      } else {
        
        // TODO Notify User
        console.log('add missing data!');

      }
    },
    checkPlayerNameInput: function(e) {
      var str = e.target.value,
          key = String.fromCharCode(e.charCode);
      // letters/dashes/spaces/dots + block enter key + single-dash/dot
      if (!/[a-zA-Z]|-|\s|\./.test(key) || e.charCode === 13) { return false; }
      else if (/-|\./.test(key) && /-|\.|\s/.test(str.substr(str.length - 1))) { return false; }
      // single-space (following letters/dots)
      else if (/\s/.test(key) && /-|\s/.test(str.substr(str.length - 1))) { return false; }
      // starts with letter
      else if (str.length === 0 && !/[a-zA-Z]/.test(key)) { return false; }
    },
    changePlayerFirstName: function(e) {
      this.props.playerData.firstname = e.target.value;
    },
    changePlayerLastName: function(e) {
      this.props.playerData.lastname = e.target.value;
    },
    changePlayerShot: function(e) {
      this.props.playerData.shot = e.target.value;
    },
    changePlayerPosition: function(e) {
      this.props.playerData.position = e.target.value;
    },
    changePlayerJersey: function(e) {
      this.props.playerData.jersey = e.target.value;
    },
    checkPlayerJerseyInput: function(e) {
      var str = e.target.value,
          key = String.fromCharCode(e.charCode);
      // numbers only + block enter key + two-digit max-length
      if (!/\d/.test(key) || e.charCode === 13 || str.length === 2) { return false; }
    },
    changePlayerSalary: function(e) {
      this.props.playerData.salary = parseFloat(e.target.value).toFixed(3);
    },
    checkPlayerSalaryInput: function(e) {
      var str = e.target.value,
          key = String.fromCharCode(e.charCode);
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
    changePlayerSalaryDuration: function(e) {
      var duration = parseInt(e.target.value);
      this.props.playerData.contract = [];
      for (var i = 0; i < duration; i++) {
        this.props.playerData.contract[i] = this.props.playerData.salary;
      }
    },
    blockPaste: function() {
      return false;
    },
    render: function() {
      return (
        <div id="createplayer" className="tab-area active">
          <div className="inner">

            <input id="create-player-fname" type="text" placeholder="First Name"
              onKeyPress={this.checkPlayerNameInput}
              onChange={this.changePlayerFirstName}
              onPaste={this.blockPaste} />
            <input id="create-player-lname" type="text" placeholder="Last Name"
              onKeyPress={this.checkPlayerNameInput}
              onChange={this.changePlayerLastName}
              onPaste={this.blockPaste} />
            <select id="create-player-shot" onChange={this.changePlayerShot}>
              <option selected disabled>Shot</option>
              <option value="L">L</option>
              <option value="R">R</option>
            </select>
            <select id="create-player-position" onChange={this.changePlayerPosition}>
              <option selected disabled>Position</option>
              <option value="LW">LW</option>
              <option value="C">C</option>
              <option value="RW">RW</option>
              <option value="D">D</option>
              <option value="G">G</option>
            </select>
            <input id="create-player-jersey" type="number" placeholder="99"
              onKeyPress={this.checkPlayerJerseyInput}
              onChange={this.changePlayerJersey}
              onPaste={this.blockPaste} />
            <input id="create-player-salary" type="number" step="1.000" placeholder="0.000"
              onKeyPress={this.checkPlayerSalaryInput}
              onChange={this.changePlayerSalary}
              onPaste={this.blockPaste} />
            <select id="create-player-salary-length" onChange={this.changePlayerSalaryDuration}>
              <option selected disabled>Years</option>
              <option value="1">1yr</option>
              <option value="2">2yr</option>
              <option value="3">3yr</option>
              <option value="4">4yr</option>
              <option value="5">5yr</option>
            </select>
            <button id="create-player-button" onClick={this.handleCreatePlayer}>Create &amp; Sign</button>
          </div>
        </div>
      );
    }
});

module.exports = CreatePlayer;
