// Cap Stats
// ==================================================
'use strict';

var CapStats = React.createClass({
  toggleMenu: function(e) {
    var view = this.props.activeView,
        id   = view + '-stats-menu',
        menu = document.getElementById(id);
    if (menu.className.indexOf(' active') === -1) {
      menu.className = menu.className + ' active';
    } else {
      menu.className = menu.className.replace(' active', '');
    }
  },
  blockClick: function(e) {
    e.preventDefault();
    return false;
  },

  render: function() {
    var view  = this.props.activeView,
        cap   = this.props.cap,
        info  = this.props.teamInfo ? this.props.teamInfo : null,
        count = this.props.playerCount ? this.props.playerCount : 0;

    return (
      <div id={ view + '-stats' } className={ view === 'roster' && count || view === 'payroll' ? 'cap-stats active' : 'cap-stats' }>
        <div className="section">
          <span>Roster Players <span className="value">{count}</span></span>
        </div>
        <div className="section">
          <span>Payroll Total <span className="value">{info.hit}</span></span>
        </div>
        <div className="section">
          <span>Cap Space <span className={ info.space > 0 ? 'value' : 'value overage' }>{info.space}</span></span>
        </div>
        <div className="section salary-cap">
          <span>Salary Cap <span className="value">{cap}</span></span>
        </div>
        <a id={ view + '-stats-button' } onClick={this.blockClick}
          className={ view === 'roster' && count || view === 'payroll' ? 'cap-stats-menu-button' : 'cap-stats-menu-button disabled' }
          onMouseEnter={ view === 'roster' && count || view === 'payroll' ? this.toggleMenu : null }>
          <i className="fa fa-gear"></i>
        </a>
        <div id={ view + '-stats-menu' } className="cap-stats-menu" onMouseLeave={this.toggleMenu}>
      { view === 'roster'
        ? <ul>
            <li><a onClick={this.props.clearRosterData}><i className="fa fa-trash"></i> Remove All</a></li>
          </ul>
        : <ul>
            <li><a><i className="fa fa-close"></i> Menu Item</a></li>
          </ul> }
        </div>
      </div>
    );
  }
});

module.exports = CapStats;
